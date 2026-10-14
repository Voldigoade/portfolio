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
    skipped: 'unavailable',
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
  return {
    id,
    name: summary.display_name,
    kind: target.type === 'repo' ? 'repository' : 'user',
    status: coverage.is_partial || limited ? 'partial' : 'complete',
    hasWarnings: Array.isArray(report.warnings) && report.warnings.length > 0,
    fields,
    coverage: providers,
    exports: ['pdf', 'md', 'json', 'txt', 'svg'],
  };
}
