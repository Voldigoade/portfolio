export const spoorConfig = {
  basePath: 'https://api--spoor--xsw6djgrvwtl.code.run/v1',
  requestTimeoutMs: 20000,
  lookupTimeoutMs: 120000,
  pollIntervalMs: 1000,
  paths: {
    lookups: '/lookups',
    lookup: (id: string) => `/lookups/${encodeURIComponent(id)}`,
    events: (id: string) => `/lookups/${encodeURIComponent(id)}/events`,
    report: (id: string) => `/lookups/${encodeURIComponent(id)}/report`,
    export: (id: string, format: string) =>
      `/lookups/${encodeURIComponent(id)}/export/${format}`,
  },
} as const;
