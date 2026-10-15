export const fixture = {
  schema_version: '1.1',
  target: { type: 'user' },
  summary: {
    display_name: 'Browser test',
    total_public_repositories: 8,
    distinct_emails_observed: 4,
    public_keys_found: 2,
    account_created: '2025-01-01T00:00:00Z',
    primary_languages: [
      ['Rust', 50],
      ['TypeScript', 25],
      ['Python', 25],
    ],
  },
  coverage: {
    is_partial: false,
    commits_scanned: 30,
    repositories_scanned: 3,
    repositories_total: 8,
  },
  profile: {
    login: 'example',
    name: 'Browser test',
    bio: 'Public profile biography.',
    followers: 12,
    html_url: 'https://github.com/example',
    avatar_url: 'https://avatars.githubusercontent.com/u/1',
  },
  identities: [
    {
      email: 'observed@example.invalid',
      email_type: 'domain_email',
      name: 'Observed name',
      sources: ['Public Git Commit Metadata'],
      repositories: ['example/repository-with-a-long-name'],
      first_seen: '2025-01-01T00:00:00Z',
      last_seen: '2026-10-01T00:00:00Z',
    },
    ...Array.from({ length: 3 }, (_, index) => ({
      email: `historical-address-with-a-long-local-part-${index}@example.invalid`,
      email_type: 'domain_email',
      sources: ['GitLeak', 'Public Git Commit Metadata'],
      repositories: [
        'example/a-very-long-repository-name-without-convenient-spaces-for-layout-testing',
      ],
      first_seen: '2024-01-01T00:00:00Z',
      last_seen: '2025-01-01T00:00:00Z',
    })),
  ],
  activity: {
    total_events_observed: 24,
    active_repositories: ['example/repo'],
    recent_actions: [{ created_at: '2026-10-01T00:00:00Z' }],
  },
  provider_status: { github: { status: 'cached' }, GitLeak: { status: 'ok' } },
  repositories: [{ languages: null, hygiene: null }],
};
