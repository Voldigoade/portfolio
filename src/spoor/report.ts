import {
  SpoorError,
  type CoverageStatus,
  type SpoorReport,
  type SummaryField,
} from './types';

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new SpoorError('provider');
  return value as Record<string, unknown>;
}
const optionalObject = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value : undefined;
const count = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
const strings = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
function publicUrl(value: unknown, hostname: string) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' &&
      url.hostname === hostname &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function mapReport(id: string, value: unknown): SpoorReport {
  const report = object(value);
  const summary = object(report.summary);
  const target = object(report.target);
  const coverage = object(report.coverage);
  if (
    report.schema_version !== '1.1' ||
    typeof summary.display_name !== 'string' ||
    !['user', 'repo'].includes(String(target.type)) ||
    typeof coverage.is_partial !== 'boolean'
  )
    throw new SpoorError('provider');
  const fields: SummaryField[] = [];
  const profile = optionalObject(report.profile);
  for (const [key, source] of [
    ['repositories', 'total_public_repositories'],
    ['identities', 'distinct_emails_observed'],
    ['keys', 'public_keys_found'],
  ]) {
    const value = summary[source];
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0)
      fields.push({ key, value });
  }
  if (typeof summary.account_created === 'string')
    fields.splice(1, 0, { key: 'created', value: summary.account_created });
  if (count(profile.followers) !== undefined)
    fields.push({ key: 'followers', value: profile.followers as number });
  if (Array.isArray(summary.primary_languages)) {
    const languages = summary.primary_languages.flatMap((item) =>
      Array.isArray(item) && typeof item[0] === 'string' ? [item[0]] : [],
    );
    if (languages.length) fields.push({ key: 'languages', value: languages });
  }
  const statuses: Record<string, CoverageStatus> = {
    ok: 'complete',
    cached: 'cached',
    partial: 'partial',
    rate_limited: 'partial',
    unavailable: 'unavailable',
    skipped: 'skipped',
  };
  const sourceProviders = object(report.provider_status ?? {});
  const limited = Object.values(sourceProviders).some((raw) =>
    ['partial', 'rate_limited', 'unavailable'].includes(
      String(object(raw).status),
    ),
  );
  const providers = Object.entries(sourceProviders).map(([provider, raw]) => {
    const state = object(raw);
    const status = statuses[String(state.status)];
    if (!status) throw new SpoorError('provider');
    return { provider, status };
  });
  const identities = Array.isArray(report.identities)
    ? report.identities.flatMap((raw) => {
        const identity = optionalObject(raw);
        const type = String(identity.email_type).replaceAll(
          'git_hub',
          'github',
        );
        const email = text(identity.email);
        if (!email || type === 'github_system') return [];
        return [
          {
            email,
            type,
            name: text(identity.name),
            sources: strings(identity.sources),
            repositories: strings(identity.repositories),
            firstSeen: text(identity.first_seen),
            lastSeen: text(identity.last_seen),
          },
        ];
      })
    : [];
  const activity = optionalObject(report.activity);
  const actions = Array.isArray(activity.recent_actions)
    ? activity.recent_actions
    : [];
  const latest = text(optionalObject(actions[0]).created_at);
  const repository = optionalObject(
    Array.isArray(report.repositories) ? report.repositories[0] : undefined,
  );
  const enrichment = providers.find(
    ({ provider }) => provider.toLowerCase() === 'gitleak',
  )?.status;
  return {
    id,
    name: text(profile.name) || summary.display_name,
    kind: target.type === 'repo' ? 'repository' : 'user',
    status: coverage.is_partial || limited ? 'partial' : 'complete',
    hasWarnings: Array.isArray(report.warnings) && report.warnings.length > 0,
    fields,
    coverage: providers,
    exports: ['pdf', 'md', 'json', 'txt', 'svg'],
    profile:
      target.type === 'user' && text(profile.login)
        ? {
            login: String(profile.login),
            bio: text(profile.bio),
            avatar: publicUrl(
              profile.avatar_url,
              'avatars.githubusercontent.com',
            ),
            url: publicUrl(profile.html_url, 'github.com'),
          }
        : undefined,
    repository:
      target.type === 'repo'
        ? {
            description: text(repository.description),
            url: publicUrl(repository.html_url, 'github.com'),
          }
        : undefined,
    identities,
    scan: {
      partial: coverage.is_partial,
      commits: count(coverage.commits_scanned),
      repositories: count(coverage.repositories_scanned),
      total: count(coverage.repositories_total),
    },
    activity:
      target.type === 'user' &&
      count(activity.total_events_observed) !== undefined
        ? {
            events: activity.total_events_observed as number,
            repositories: strings(activity.active_repositories).length,
            latest,
          }
        : undefined,
    enrichment,
  };
}
