import { useState } from 'react';
import { Button } from '@once-ui-system/core/components/Button';
import type { Locale } from '../../data/locales';
import type { SpoorClient, SpoorReport } from '../../spoor/types';
import { spoorCopy } from '../../spoor/copy';
import { ExportMenu } from './ExportMenu';
import { displayValue, summaryText, visibleFields } from '../../spoor/summary';
import { reportCopy } from '../../spoor/report-copy';
import { ReportEvidence } from './ReportEvidence';

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
        <div className="report-person">
          {report.profile?.avatar && (
            <img
              className="profile-avatar"
              src={report.profile.avatar}
              width="48"
              height="48"
              alt=""
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
            />
          )}
          <div>
            <h3>{report.name}</h3>
            <p>
              {report.profile
                ? `@${report.profile.login}`
                : report.kind === 'user'
                  ? t.user
                  : t.repository}
            </p>
            {report.profile?.url && (
              <a className="profile-link" href={report.profile.url}>
                {reportCopy[locale].profile} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <span className="report-status">
          <span aria-hidden="true">
            {report.status === 'complete' ? '✓' : '◐'}
          </span>
          {t[report.status]}
        </span>
      </header>
      {report.repository?.url && (
        <a className="profile-link" href={report.repository.url}>
          {t.repository} <span aria-hidden="true">↗</span>
        </a>
      )}
      {report.repository?.description && (
        <p className="profile-bio">{report.repository.description}</p>
      )}
      {report.profile?.bio && (
        <p className="profile-bio">{report.profile.bio}</p>
      )}
      {report.status === 'partial' && !report.scan && (
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
      <ReportEvidence report={report} locale={locale} />
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
