import type { ProgressLine, SpoorReport } from '../types';

export const demoScenes = [
  'idle',
  'populated',
  'starting',
  'progress',
  'complete',
  'error',
  'rateLimited',
  'partial',
] as const;
export type DemoScene = (typeof demoScenes)[number];

export const progressFixture: ProgressLine[] = [
  {
    id: 'resolve',
    provider: 'resolve',
    detail: 'github user',
    status: 'complete',
  },
  { id: 'github', provider: 'github', detail: 'profile', status: 'complete' },
  { id: 'repos', provider: 'repos', detail: '8 / 8', status: 'complete' },
  {
    id: 'commits',
    provider: 'commits',
    detail: '250 sampled',
    status: 'partial',
  },
  { id: 'gitleak', provider: 'gitleak', detail: 'cached', status: 'cached' },
  { id: 'keys', provider: 'keys', detail: '1 gpg · 2 ssh', status: 'complete' },
];

export const reportFixture: SpoorReport = {
  id: 'demo-lookup',
  name: 'demo-user',
  kind: 'user',
  status: 'complete',
  fields: [
    { key: 'repositories', value: 8 },
    { key: 'created', value: '2019-06-12' },
    { key: 'languages', value: ['Rust', 'TypeScript', 'Python'] },
    { key: 'keys', value: '1 GPG · 2 SSH' },
  ],
  coverage: [
    { provider: 'GitHub', status: 'complete' },
    { provider: 'Commits', status: 'partial' },
    { provider: 'GitLeak', status: 'cached' },
  ],
  exports: [],
};
