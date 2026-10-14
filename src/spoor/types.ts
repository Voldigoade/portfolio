export type LookupMode = 'fast' | 'deep';
export type ExportFormat = 'pdf' | 'md' | 'json' | 'txt' | 'svg';
export type LookupStatus = 'pending' | 'running' | 'completed' | 'failed';
export type CoverageStatus = 'complete' | 'partial' | 'cached' | 'unavailable';

export interface LookupTarget {
  value: string;
  kind: 'user' | 'repository';
  githubUrl: string;
}

export interface LookupRef {
  id: string;
  status: LookupStatus;
}

export interface ProgressLine {
  id: string;
  provider: string;
  detail: string;
  status: 'pending' | 'running' | 'complete' | 'partial' | 'cached';
}

export interface SummaryField {
  key: string;
  value: string | number | string[];
  label?: string;
}

export interface SpoorReport {
  id: string;
  name: string;
  kind: 'user' | 'repository';
  status: 'complete' | 'partial';
  fields: SummaryField[];
  coverage: { provider: string; status: CoverageStatus }[];
  hasWarnings?: boolean;
  exports?: ExportFormat[];
}

export type LookupEvent =
  | { type: 'progress'; line: ProgressLine }
  | { type: 'finished'; status: 'complete' | 'partial' }
  | {
      type: 'failed';
      code: 'notFound' | 'provider' | 'rateLimited';
      retryAfter?: number;
    };

export interface SpoorClient {
  readonly kind: 'demo' | 'http';
  startLookup(
    target: LookupTarget,
    mode: LookupMode,
    signal: AbortSignal,
  ): Promise<LookupRef>;
  subscribeToLookup(
    id: string,
    onEvent: (event: LookupEvent) => void,
    onError: (error?: SpoorError) => void,
  ): () => void;
  getReport(id: string, signal: AbortSignal): Promise<SpoorReport>;
  getExportUrl(id: string, format: ExportFormat): Promise<string | null>;
}

export class SpoorError extends Error {
  constructor(
    public readonly code:
      | 'invalidTarget'
      | 'network'
      | 'provider'
      | 'notFound'
      | 'rateLimited'
      | 'notReady'
      | 'timeout',
    public readonly retryAfter?: number,
  ) {
    super(code);
    this.name = 'SpoorError';
  }
}
