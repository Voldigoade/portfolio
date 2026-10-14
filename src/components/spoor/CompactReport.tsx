import { useState } from 'react';
import { Button } from '@once-ui-system/core/components/Button';
import type { Locale } from '../../data/locales';
import type { SpoorClient, SpoorReport } from '../../spoor/types';
import { spoorCopy } from '../../spoor/copy';
import { ExportMenu } from './ExportMenu';
import { displayValue, summaryText, visibleFields } from '../../spoor/summary';

export function CompactReport({
  client,
  report,
  locale,
}: {
  client: SpoorClient;
  report: SpoorReport;
  locale: Locale;
}) {
  const t = spoorCopy[locale];
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const fields = visibleFields(report);
  const copy = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(summaryText(report, locale));
      setCopied(true);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <div className="compact-report" data-report-status={report.status}>
      <header className="report-heading">
        <div>
          <h3>{report.name}</h3>
          <p>{report.kind === 'user' ? t.user : t.repository}</p>
        </div>
        <span className="report-status">
          <span aria-hidden="true">
            {report.status === 'complete' ? '✓' : '◐'}
          </span>
          {t[report.status]}
        </span>
      </header>
      {report.status === 'partial' && (
        <p className="partial-notice">{t.partialText}</p>
      )}
      {report.status !== 'partial' && report.hasWarnings && (
        <p className="partial-notice">{t.warningText}</p>
      )}
      <dl className="report-fields">
        {fields.map((field) => (
          <div key={field.key}>
            <dt>{t.fields[field.key] || field.label || field.key}</dt>
            <dd>{displayValue(locale, field.key, field.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="report-actions">
        <Button
          type="button"
          variant="secondary"
          rounded
          size="s"
          onClick={() => void copy()}
        >
          {t.copy}
        </Button>
        <ExportMenu client={client} report={report} locale={locale} />
        <span className="copy-feedback" role="status">
          {copied ? t.copied : ''}
        </span>
      </div>
      {copyError && (
        <p className="inline-error" role="alert">
          {t.copyError}
        </p>
      )}
    </div>
  );
}
