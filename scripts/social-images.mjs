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
  fr: 'Logiciels, systèmes, sécurité.',
  en: 'Software, systems, security.',
  es: 'Software, sistemas, seguridad.',
};
const dots = [];
for (let x = 130; x < 1070; x += 8) {
  for (let y = 4; y < 360; y += 8) {
    const distance = Math.sqrt(((x - 600) / 480) ** 2 + (y / 360) ** 2);
    const opacity = Math.max(0, 1 - distance) * 0.65;
    dots.push(
      `<circle cx="${x}" cy="${y}" r="0.8" fill="${colors.muted}" opacity="${opacity}"/>`,
    );
  }
}
await mkdir('public', { recursive: true });
for (const [locale, label] of Object.entries(labels)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${colors.background}"/>${dots.join('')}<text x="600" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="100" font-weight="600" letter-spacing="-5" fill="${colors.text}">Voldigoade</text><text x="600" y="390" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="${colors.muted}">${label}</text></svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(`public/og-${locale}.png`);
}
