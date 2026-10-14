import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const labels = {
  fr: 'logiciels · systèmes · sécurité · vie privée',
  en: 'software · systems · security · privacy',
  es: 'software · sistemas · seguridad · privacidad',
};

await mkdir('public', { recursive: true });
for (const [locale, label] of Object.entries(labels)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#111417"/><g fill="none" stroke="#343e46"><path d="M80 80H1080M80 550H450L466 562H1120M890 175H1000L1035 210H1120M915 270H1015L1050 305H1120M940 365H1030L1065 400H1120"/></g><path d="M80 80H190L205 92H320" fill="none" stroke="#94bdd5"/><path d="M80 176 97 213H101L118 176M80 194H88M110 194H118" fill="none" stroke="#94bdd5" stroke-width="3"/><text x="76" y="337" font-family="Arial, sans-serif" font-weight="500" font-size="88" letter-spacing="-4" fill="#e9edf0">Voldigoade</text><text x="80" y="400" font-family="Arial, sans-serif" font-size="27" fill="#a5afb7">${label}</text></svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(`public/og-${locale}.png`);
}
