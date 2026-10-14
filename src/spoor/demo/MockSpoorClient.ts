import { progressFixture, reportFixture, type DemoScene } from './fixtures';
import type {
  ExportFormat,
  LookupEvent,
  LookupMode,
  LookupTarget,
  SpoorClient,
  SpoorReport,
} from '../types';

export class MockSpoorClient implements SpoorClient {
  readonly kind = 'demo';
  constructor(private readonly scene: DemoScene = 'complete') {}

  async startLookup(
    _target: LookupTarget,
    _mode: LookupMode,
    signal: AbortSignal,
  ) {
    signal.throwIfAborted();
    return { id: 'demo-lookup', status: 'running' as const };
  }

  subscribeToLookup(
    _id: string,
    onEvent: (event: LookupEvent) => void,
    _onError: () => void,
  ) {
    let subscribed = true;
    queueMicrotask(() => {
      if (!subscribed || this.scene === 'starting') return;
      if (this.scene === 'error' || this.scene === 'rateLimited') {
        onEvent({
          type: 'failed',
          code: this.scene === 'error' ? 'provider' : 'rateLimited',
          retryAfter: this.scene === 'rateLimited' ? 60 : undefined,
        });
        return;
      }
      for (const line of progressFixture.slice(
        0,
        this.scene === 'progress' ? 3 : undefined,
      )) {
        if (!subscribed) return;
        onEvent({
          type: 'progress',
          line:
            this.scene === 'progress' && line.id === 'repos'
              ? { ...line, detail: '3 / 8', status: 'running' }
              : line,
        });
      }
      if (subscribed && this.scene !== 'progress')
        onEvent({
          type: 'finished',
          status: this.scene === 'partial' ? 'partial' : 'complete',
        });
    });
    return () => {
      subscribed = false;
    };
  }

  async getReport(_id: string, signal: AbortSignal): Promise<SpoorReport> {
    signal.throwIfAborted();
    const report = structuredClone(reportFixture);
    if (this.scene === 'partial') {
      report.status = 'partial';
      report.fields = report.fields.filter((field) => field.key !== 'created');
      report.coverage[2].status = 'unavailable';
    }
    return report;
  }

  async getExportUrl(_id: string, _format: ExportFormat) {
    return null;
  }
}
