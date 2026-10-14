import { spoorConfig } from './config';
import { mapReport, object } from './report';
import { fetchResponse } from './transport';
import {
  SpoorError,
  type ExportFormat,
  type LookupEvent,
  type LookupMode,
  type LookupRef,
  type LookupTarget,
  type SpoorClient,
  type ProgressLine,
} from './types';

const eventNames = [
  'lookup.started',
  'target.resolved',
  'provider.started',
  'provider.completed',
  'provider.warning',
  'scan.progress',
  'analysis.completed',
  'lookup.failed',
] as const;
const string = (value: unknown) => (typeof value === 'string' ? value : '');

export class HttpSpoorClient implements SpoorClient {
  readonly kind = 'http';
  constructor(
    private readonly basePath: string = spoorConfig.basePath,
    private readonly timing: {
      requestTimeoutMs: number;
      lookupTimeoutMs: number;
      pollIntervalMs: number;
    } = spoorConfig,
  ) {}

  private async request(
    path: string,
    signal: AbortSignal,
    options: RequestInit = {},
  ): Promise<unknown> {
    const response = await fetchResponse(
      this.basePath + path,
      signal,
      options,
      this.timing.requestTimeoutMs,
    );
    return response.json().catch(() => {
      throw new SpoorError('provider');
    });
  }

  private lookup(value: unknown): LookupRef {
    const lookup = object(value);
    if (
      typeof lookup.id !== 'string' ||
      !lookup.id ||
      !['pending', 'running', 'completed', 'failed'].includes(
        String(lookup.status),
      )
    )
      throw new SpoorError('provider');
    return { id: lookup.id, status: lookup.status as LookupRef['status'] };
  }

  async startLookup(
    target: LookupTarget,
    mode: LookupMode,
    signal: AbortSignal,
  ) {
    return this.lookup(
      await this.request(spoorConfig.paths.lookups, signal, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.value, mode }),
      }),
    );
  }

  subscribeToLookup(
    id: string,
    onEvent: (event: LookupEvent) => void,
    onError: (error?: SpoorError) => void,
  ) {
    const controller = new AbortController();
    const stream = new EventSource(
      this.basePath + spoorConfig.paths.events(id),
      { withCredentials: false },
    );
    let closed = false;
    let checking = false;
    const close = () => {
      closed = true;
      controller.abort();
      stream.close();
      clearInterval(poll);
      clearTimeout(deadline);
    };
    const fail = (error: unknown) => {
      if (closed) return;
      close();
      onError(error instanceof SpoorError ? error : new SpoorError('network'));
    };
    const checkStatus = async () => {
      if (closed || checking) return;
      checking = true;
      try {
        const lookup = this.lookup(
          await this.request(spoorConfig.paths.lookup(id), controller.signal),
        );
        if (closed) return;
        if (lookup.status === 'completed') {
          close();
          onEvent({ type: 'finished', status: 'complete' });
        } else if (lookup.status === 'failed') fail(new SpoorError('provider'));
      } catch (error) {
        if (!closed) fail(error);
      } finally {
        checking = false;
      }
    };
    for (const name of eventNames)
      stream.addEventListener(name, (message: MessageEvent) => {
        if (closed) return;
        try {
          const envelope = object(JSON.parse(message.data));
          const data = object(envelope.data ?? envelope);
          if (name === 'analysis.completed') {
            void checkStatus();
            return;
          }
          if (name === 'lookup.failed') {
            fail(new SpoorError('provider'));
            return;
          }
          const provider = string(data.provider);
          let line: ProgressLine;
          if (name.startsWith('provider.'))
            line = {
              id: provider,
              provider,
              detail: string(data.operation || data.details || data.message),
              status:
                name === 'provider.started'
                  ? 'running'
                  : name === 'provider.warning'
                    ? 'partial'
                    : 'complete',
            };
          else if (name === 'scan.progress')
            line = {
              id: 'scan',
              provider: 'GitHub',
              detail:
                typeof data.current === 'number' &&
                typeof data.total === 'number'
                  ? `${data.current} / ${data.total}`
                  : string(data.message),
              status: 'running',
            };
          else
            line = {
              id: name,
              provider: 'GitHub',
              detail: string(data.target),
              status: name === 'target.resolved' ? 'complete' : 'running',
            };
          onEvent({ type: 'progress', line });
        } catch {
          fail(new SpoorError('provider'));
        }
      });
    stream.onerror = () => {
      stream.close();
      void checkStatus();
    };
    // v0.1 broadcasts without replay; status also covers a lookup that finished before subscription.
    const poll = setInterval(
      () => void checkStatus(),
      this.timing.pollIntervalMs,
    );
    const deadline = setTimeout(
      () => fail(new SpoorError('timeout')),
      this.timing.lookupTimeoutMs,
    );
    void checkStatus();
    return close;
  }

  async getReport(id: string, signal: AbortSignal) {
    return mapReport(
      id,
      await this.request(spoorConfig.paths.report(id), signal),
    );
  }

  async getExportUrl(id: string, format: ExportFormat) {
    return this.basePath + spoorConfig.paths.export(id, format);
  }
}
