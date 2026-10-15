import type { Locale } from '../../data/locales';
import type { SpoorReport } from '../../spoor/types';
import { reportCopy } from '../../spoor/report-copy';
import { spoorCopy } from '../../spoor/copy';
import { displayValue } from '../../spoor/summary';

export function ReportEvidence({
  report,
  locale,
}: {
  report: SpoorReport;
  locale: Locale;
}) {
  const t = reportCopy[locale];
  const status = spoorCopy[locale].statuses;
  const date = (value: string) => displayValue(locale, 'created', value);
  return (
    <div className="report-evidence">
      {Boolean(report.identities?.length) && (
        <details className="identity-evidence">
          <summary>
            {t.identities} <span>{report.identities!.length}</span>
          </summary>
          <p className="evidence-note">{t.evidence}</p>
          <ul className="observed-identities">
            {report.identities!.slice(0, 5).map((identity) => (
              <li key={identity.email}>
                <p className="observed-email">{identity.email}</p>
                <p className="identity-context">
                  {[
                    identity.name,
                    identity.type === 'public_profile'
                      ? t.publicProfile
                      : identity.type.includes('no_reply')
                        ? t.noReply
                        : undefined,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <dl>
                  {identity.sources.length > 0 && (
                    <div>
                      <dt>{t.sources}</dt>
                      <dd>{identity.sources.join(' · ')}</dd>
                    </div>
                  )}
                  {identity.repositories.length > 0 && (
                    <div>
                      <dt>{t.repositories}</dt>
                      <dd>{identity.repositories.slice(0, 3).join(' · ')}</dd>
                    </div>
                  )}
                  {identity.firstSeen && (
                    <div>
                      <dt>{t.first}</dt>
                      <dd>{date(identity.firstSeen)}</dd>
                    </div>
                  )}
                  {identity.lastSeen && (
                    <div>
                      <dt>{t.last}</dt>
                      <dd>{date(identity.lastSeen)}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
          {report.identities!.length > 5 && (
            <p className="evidence-note">{t.more}</p>
          )}
        </details>
      )}
      {report.activity && (
        <div className="activity-summary">
          <h4>{t.activity}</h4>
          <p>
            {report.activity.events}{' '}
            {report.activity.events === 1 ? t.event : t.events} ·{' '}
            {report.activity.repositories}{' '}
            {report.activity.repositories === 1 ? t.activeRepo : t.activeRepos}
            {report.activity.latest && (
              <>
                {' '}
                · {t.latest.toLowerCase()} {date(report.activity.latest)}
              </>
            )}
          </p>
          <p className="evidence-note">{t.window}</p>
        </div>
      )}
      {report.scan && (
        <div className="coverage-summary">
          <h4>{t.coverage}</h4>
          {report.scan.partial && <p>{t.sample}</p>}
          {(report.scan.commits !== undefined ||
            report.scan.repositories !== undefined) && (
            <p className="evidence-note">
              {report.scan.commits !== undefined && (
                <>
                  {report.scan.commits}{' '}
                  {report.scan.commits === 1 ? t.commit : t.commits}
                </>
              )}
              {report.scan.repositories !== undefined && (
                <>
                  {' '}
                  · {report.scan.repositories}
                  {report.scan.total !== undefined
                    ? `/${report.scan.total}`
                    : ''}{' '}
                  {report.scan.repositories === 1 ? t.repo : t.repos}
                </>
              )}
            </p>
          )}
          <ul className="provider-coverage">
            {report.coverage.map((provider) => (
              <li key={provider.provider}>
                {provider.provider} <span>{status[provider.status]}</span>
              </li>
            ))}
          </ul>
          {report.enrichment &&
            ['unavailable', 'partial'].includes(report.enrichment) && (
              <p className="enrichment-note">
                {t.enrichment} :{' '}
                {report.enrichment === 'unavailable'
                  ? t.unavailable
                  : t.limited}
              </p>
            )}
        </div>
      )}
    </div>
  );
}
