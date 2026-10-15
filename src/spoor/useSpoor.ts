import { useCallback, useEffect, useRef, useState } from 'react';
import { parseTarget } from './target';
import {
  SpoorError,
  type LookupEvent,
  type LookupTarget,
  type ProgressLine,
  type SpoorClient,
  type SpoorReport,
} from './types';

type State = {
  phase:
    | 'idle'
    | 'starting'
    | 'running'
    | 'complete'
    | 'partial'
    | 'error'
    | 'rateLimited';
  target?: LookupTarget;
  lines: ProgressLine[];
  report?: SpoorReport;
  error?: SpoorError;
  recovering?: boolean;
};
const initial: State = { phase: 'idle', lines: [] };

export function useSpoor(client: SpoorClient) {
  const [state, setState] = useState<State>(initial);
  const active = useRef<{
    controller: AbortController;
    unsubscribe?: () => void;
  } | null>(null);
  const cancel = useCallback(() => {
    active.current?.controller.abort();
    active.current?.unsubscribe?.();
    active.current = null;
  }, []);
  const reset = useCallback(() => {
    cancel();
    setState(initial);
  }, [cancel]);
  useEffect(() => cancel, [client, cancel]);

  const run = useCallback(
    async (raw: string) => {
      cancel();
      setState(initial);
      const session = {
        controller: new AbortController(),
        unsubscribe: undefined as (() => void) | undefined,
      };
      active.current = session;
      const signal = session.controller.signal;
      let finishing = false;
      let settled = false;
      const fail = (error: unknown) => {
        if (settled || signal.aborted || active.current !== session) return;
        settled = true;
        session.unsubscribe?.();
        const problem =
          error instanceof SpoorError ? error : new SpoorError('provider');
        setState((previous) => ({
          ...previous,
          phase: problem.code === 'rateLimited' ? 'rateLimited' : 'error',
          report: undefined,
          error: problem,
        }));
      };
      try {
        const target = parseTarget(raw);
        setState({ phase: 'starting', target, lines: [] });
        const lookup = await client.startLookup(target, 'fast', signal);
        if (signal.aborted || active.current !== session) return;
        const finish = async () => {
          if (
            finishing ||
            settled ||
            signal.aborted ||
            active.current !== session
          )
            return;
          finishing = true;
          session.unsubscribe?.();
          try {
            const report = await client.getReport(lookup.id, signal);
            if (!signal.aborted && active.current === session && !settled) {
              settled = true;
              setState((previous) => ({
                ...previous,
                phase: report.status,
                report,
                error: undefined,
                recovering: false,
              }));
            }
          } catch (error) {
            fail(error);
          }
        };
        if (lookup.status === 'completed') {
          await finish();
          return;
        }
        if (lookup.status === 'failed') throw new SpoorError('provider');
        const receive = (event: LookupEvent) => {
          if (
            finishing ||
            settled ||
            signal.aborted ||
            active.current !== session
          )
            return;
          if (event.type === 'connection')
            setState((previous) => ({
              ...previous,
              recovering: event.recovering,
            }));
          else if (event.type === 'progress')
            setState((previous) => ({
              ...previous,
              phase: 'running',
              lines: [
                ...previous.lines.filter((line) => line.id !== event.line.id),
                event.line,
              ],
            }));
          else if (event.type === 'finished') void finish();
          else fail(new SpoorError(event.code, event.retryAfter));
        };
        session.unsubscribe = client.subscribeToLookup(
          lookup.id,
          receive,
          (error) => {
            if (!finishing) fail(error || new SpoorError('network'));
          },
        );
        if (finishing || settled) session.unsubscribe?.();
      } catch (error) {
        fail(error);
      }
    },
    [client, cancel],
  );
  return { ...state, run, reset };
}
