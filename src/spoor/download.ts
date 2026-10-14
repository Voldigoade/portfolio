import { fetchResponse } from './transport';
import type { ExportFormat } from './types';

export function exportFilename(
  disposition: string | null,
  fallback: string,
): string {
  const encoded = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = disposition?.match(/filename="([^"]+)"|filename=([^;]+)/i);
  let filename = plain?.[1] || plain?.[2]?.trim() || fallback;
  if (encoded) {
    try {
      filename = decodeURIComponent(encoded);
    } catch {
      filename = fallback;
    }
  }
  return (
    Array.from(filename, (character) =>
      character.charCodeAt(0) < 32 || /[\\/<>:"|?*]/.test(character)
        ? '-'
        : character,
    )
      .join('')
      .slice(0, 180) || fallback
  );
}

export async function downloadExport(
  url: string,
  format: ExportFormat,
  name: string,
): Promise<void> {
  const response = await fetchResponse(url, new AbortController().signal);
  const blob = await response.blob();
  if (!blob.size || response.headers.get('Content-Type')?.includes('text/html'))
    throw new Error('Invalid export');
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = exportFilename(
    response.headers.get('Content-Disposition'),
    `spoor-${name.replace(/[^a-z\d_-]/gi, '-')}.${format}`,
  );
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
