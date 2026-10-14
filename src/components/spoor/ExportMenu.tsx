import { useState } from 'react';
import { Button } from '@once-ui-system/core/components/Button';
import { Menu } from '../site/Menu';
import type { ExportFormat, SpoorClient, SpoorReport } from '../../spoor/types';
import type { Locale } from '../../data/locales';
import { spoorCopy } from '../../spoor/copy';
import { downloadExport } from '../../spoor/download';

const formats: { id: ExportFormat; label: string }[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'md', label: 'Markdown' },
  { id: 'json', label: 'JSON' },
  { id: 'txt', label: 'TXT' },
  { id: 'svg', label: 'SVG' },
];

export function safeReportUrl(raw?: string | null): string | undefined {
  if (
    !raw ||
    Array.from(raw).some(
      (character) => character.charCodeAt(0) <= 32 || character === '\\',
    )
  )
    return undefined;
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function ExportMenu({
  client,
  report,
  locale,
}: {
  client: SpoorClient;
  report: SpoorReport;
  locale: Locale;
}) {
  const t = spoorCopy[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const download = async (format: ExportFormat) => {
    setBusy(true);
    setError(false);
    try {
      const url = safeReportUrl(await client.getExportUrl(report.id, format));
      if (!url) throw new Error('Unavailable');
      await downloadExport(url, format, report.name);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="export-control">
      <Menu label={t.export} variant="secondary" align="start" busy={busy}>
        {(close) => (
          <div className="export-menu">
            <p>{t.formats}</p>
            {formats.map((format) => (
              <Button
                key={format.id}
                type="button"
                role="menuitem"
                variant="tertiary"
                fillWidth
                horizontal="start"
                disabled={
                  client.kind !== 'http' ||
                  !report.exports?.includes(format.id) ||
                  busy
                }
                onClick={() => {
                  close();
                  void download(format.id);
                }}
              >
                {format.label}
              </Button>
            ))}
            {client.kind !== 'http' && (
              <span className="export-note">{t.unavailable}</span>
            )}
          </div>
        )}
      </Menu>
      {error && (
        <p className="inline-error" role="alert">
          {t.exportError}
        </p>
      )}
    </div>
  );
}
