import type { ProgressLine } from '../../spoor/types';
import { spoorCopy } from '../../spoor/copy';
import type { Locale } from '../../data/locales';

export function ProgressLog({
  lines,
  locale,
}: {
  lines: ProgressLine[];
  locale: Locale;
}) {
  const t = spoorCopy[locale];
  return (
    <ol className="progress-log" aria-label={t.running}>
      {lines.map((line) => (
        <li className="progress-line" key={line.id}>
          <span className="provider-name">{line.provider}</span>
          <span className="provider-detail">{line.detail}</span>
          <span className={`provider-state state-${line.status}`}>
            {line.status === 'complete' ? 'ok' : t.statuses[line.status]}
          </span>
        </li>
      ))}
    </ol>
  );
}
