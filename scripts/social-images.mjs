import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';

const css = await readFile('src/styles/global.css', 'utf8');
const colors = Object.fromEntries(
  [...css.matchAll(/--color-([\w-]+):\s*(#[a-f\d]{6})/gi)].map((match) => [
    match[1],
    match[2],
  ]),
);
const labels = {
  fr: 'D’une couche à l’autre.',
  en: 'From one layer to the next.',
  es: 'De una capa a la siguiente.',
};
const dots = [];
for (let x = 24; x < 1200; x += 24) {
  for (let y = 24; y < 630; y += 24) {
    const opacity = (Math.abs(x - 600) / 600) * 0.38;
    dots.push(
      `<circle cx="${x}" cy="${y}" r="0.8" fill="${colors.primary}" opacity="${opacity}"/>`,
    );
  }
}
await mkdir('public', { recursive: true });
for (const [locale, label] of Object.entries(labels)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${colors.background}"/>${dots.join('')}<g fill="none" stroke="${colors.primary}" stroke-opacity="0.45"><path d="M0 180H120V120H240V330H150V450H300V580M1200 410H1030V270H1110V180H990V90H870V0"/></g><g fill="${colors.primary}"><rect x="237" y="117" width="6" height="6"/><rect x="1027" y="407" width="6" height="6"/></g><text x="600" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="110" letter-spacing="-6" fill="${colors.text}">Voldigoade</text><text x="600" y="390" text-anchor="middle" font-family="Arial,sans-serif" font-size="32" fill="${colors.muted}">${label}</text><path d="M558 500H606V524H642" fill="none" stroke="${colors.primary}"/></svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(`public/og-${locale}.png`);
}
