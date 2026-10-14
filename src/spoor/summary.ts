import type { Locale } from '../data/locales';
import type { SpoorReport } from './types';
import { spoorCopy } from './copy';

export function displayValue(
  locale: Locale,
  key: string,
  value: string | number | string[],
) {
  if (Array.isArray(value)) return value.join(' · ');
  if (key === 'created' && typeof value === 'string') {
    const date = new Date(value.length === 10 ? value + 'T00:00:00Z' : value);
    if (!Number.isNaN(date.valueOf()))
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(date);
  }
  return typeof value === 'number'
    ? new Intl.NumberFormat(locale).format(value)
    : value;
}

export function visibleFields(report: SpoorReport) {
  return report.fields.filter(
    (field) =>
      field.value !== '' &&
      (!Array.isArray(field.value) || field.value.length > 0),
  );
}

export function summaryText(report: SpoorReport, locale: Locale) {
  const t = spoorCopy[locale];
  return [
    report.name,
    report.kind === 'user' ? t.user : t.repository,
    t[report.status],
    ...visibleFields(report).map(
      (field) =>
        `${t.fields[field.key] || field.label || field.key}: ${displayValue(locale, field.key, field.value)}`,
    ),
  ].join('\n');
}
