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
      const fail = (error: unknown) => {
        if (signal.aborted || active.current !== session) return;
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
          session.unsubscribe?.();
          try {
            const report = await client.getReport(lookup.id, signal);
            if (!signal.aborted && active.current === session)
              setState((previous) => ({
                ...previous,
                phase: report.status,
                report,
              }));
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
          if (signal.aborted || active.current !== session) return;
          if (event.type === 'progress')
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
          (error) => fail(error || new SpoorError('network')),
        );
      } catch (error) {
        fail(error);
      }
    },
    [client, cancel],
  );
  return { ...state, run, reset };
}
