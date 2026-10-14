import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const origin =
  process.env.SITE_URL || 'https://voldigoade-portfolio.vercel.app';
const routes = {
  fr: ['/', '/projets/secure-messaging', '/confidentialite'],
  en: ['/en', '/en/projects/secure-messaging', '/en/privacy'],
  es: ['/es', '/es/proyectos/secure-messaging', '/es/privacidad'],
};

function htmlAt(path) {
  return readFileSync(resolve('dist', `.${path}`, 'index.html'), 'utf8');
}

test('every localized page has a complete canonical and language cluster', () => {
  const titles = new Set();
  for (const [locale, paths] of Object.entries(routes)) {
    for (const [index, path] of paths.entries()) {
      const html = htmlAt(path);
      assert.ok(html.includes(`lang="${locale}"`));
      assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`));
      assert.ok(html.includes('hreflang="x-default"'));
      for (const [lang, equivalent] of Object.entries(routes)) {
        assert.ok(
          html.includes(
            `hreflang="${lang}" href="${origin}${equivalent[index]}"`,
          ),
        );
        assert.ok(
          html.includes(`href="${equivalent[index]}" hreflang="${lang}"`),
        );
      }
      assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
      assert.ok(html.includes('id="main"'));
      assert.ok(html.includes('class="skip-link"'));
      const title = html.match(/<title>(.*?)<\/title>/)?.[1];
      assert.ok(title);
      assert.ok(!titles.has(title), `Duplicate title: ${title}`);
      titles.add(title);
    }
  }
});

test('internal links, section targets and local assets exist', () => {
  const files = readdirSync('dist', { recursive: true }).filter((file) =>
    file.endsWith('.html'),
  );
  for (const file of files) {
    const html = readFileSync(join('dist', file), 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      const href = match[1];
      if (/^(https?:|data:)/.test(href)) continue;
      const [path, hash] = href.split('#');
      const target = path ? resolve('dist', `.${path}`) : join('dist', file);
      if (hash) {
        const targetHtml = path ? htmlAt(path) : html;
        assert.ok(
          targetHtml.includes(`id="${hash}"`),
          `${file}: missing ${href}`,
        );
      } else {
        assert.ok(
          existsSync(target) ||
            existsSync(join(target, 'index.html')) ||
            existsSync(`${target}.html`),
          `${file}: missing ${href}`,
        );
      }
    }
  }
});

test('privacy and security surface stays static and same-origin', () => {
  const files = readdirSync('dist', { recursive: true });
  assert.equal(files.filter((file) => file.endsWith('.map')).length, 0);
  for (const file of files.filter((file) => /\.(html|js|css)$/.test(file))) {
    const text = readFileSync(join('dist', file), 'utf8');
    assert.doesNotMatch(
      text,
      /C:\\\\Users|\/Users\/|\/home\/|sk-proj-|ghp_[A-Za-z0-9]/i,
    );
    assert.doesNotMatch(
      text,
      /google-analytics|googletagmanager|hotjar|facebook\.net|localStorage|sessionStorage|document\.cookie/,
    );
    assert.doesNotMatch(text, /<(?:script|img|iframe)[^>]+src="https?:/);
    assert.doesNotMatch(text, /https?:\/\/fonts\.(googleapis|gstatic)/);
  }
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const headers = config.headers[0].headers;
  assert.ok(
    headers.some(
      (header) =>
        header.key === 'Content-Security-Policy' &&
        !header.value.includes('unsafe-inline'),
    ),
  );
  assert.ok(
    headers.some(
      (header) =>
        header.key === 'Referrer-Policy' && header.value === 'no-referrer',
    ),
  );
});

test('project status, source links and limitations remain honest in each locale', () => {
  for (const paths of Object.values(routes)) {
    const home = htmlAt(paths[0]);
    const project = htmlAt(paths[1]);
    assert.equal((home.match(/class="project-feature"/g) || []).length, 1);
    assert.ok(
      project.includes('https://github.com/Voldigoade/recherche-messageries'),
    );
    assert.ok(
      project.includes('https://voldigoade.github.io/recherche-messageries/'),
    );
    assert.equal((project.match(/<dt>/g) || []).length, 4);
    assert.doesNotMatch(
      project,
      /coming soon|lorem ipsum|TODO|Available for work/,
    );
  }
});

test('design tokens match their documented values', () => {
  const design = readFileSync('DESIGN.md', 'utf8');
  const css = readFileSync('src/styles/global.css', 'utf8');
  const colorBlock = design.split('colors:')[1].split('typography:')[0];
  for (const match of colorBlock.matchAll(
    /([\w-]+): ['"](#[a-f\d]{6})['"]/gi,
  )) {
    assert.ok(
      css
        .toLowerCase()
        .includes(`--color-${match[1]}: ${match[2]}`.toLowerCase()),
    );
  }
});

test('robots, sitemap, error pages and social previews are complete', () => {
  const xml = readFileSync('dist/sitemap.xml', 'utf8');
  assert.equal((xml.match(/<url>/g) || []).length, 9);
  assert.equal((xml.match(/hreflang="x-default"/g) || []).length, 9);
  assert.ok(
    readFileSync('dist/robots.txt', 'utf8').includes(`${origin}/sitemap.xml`),
  );
  for (const file of ['404.html', 'en/404/index.html', 'es/404/index.html']) {
    assert.ok(
      readFileSync(join('dist', file), 'utf8').includes('noindex,follow'),
    );
  }
  for (const locale of Object.keys(routes)) {
    const png = readFileSync(`dist/og-${locale}.png`);
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
});
