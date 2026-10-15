import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

assert.equal(
  process.env.SPOOR_REAL_E2E,
  '1',
  'Set SPOOR_REAL_E2E=1 to authorize real backend work',
);
const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4326';
const output = process.env.PORTFOLIO_QA_OUTPUT;
assert.ok(output, 'Set PORTFOLIO_QA_OUTPUT outside the repository');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PORTFOLIO_BROWSER || 'msedge',
  headless: true,
});
const result = {
  completed: false,
  lookups: [],
  exports: [],
  errors: [],
  sse: [],
  requests: [],
  copy: false,
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => result.errors.push(error.message));
  page.on('request', (request) => {
    if (request.url().includes('/v1/lookups') && request.method() === 'POST') {
      assert.equal(request.postDataJSON().mode, 'fast');
      assert.equal(request.postDataJSON().enrich, true);
      result.requests.push(request.postDataJSON());
    }
  });
  page.on('response', async (response) => {
    if (response.url().endsWith('/events'))
      result.sse.push({
        status: response.status(),
        type: response.headers()['content-type'],
      });
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  let sseEvents = 0;
  cdp.on('Network.eventSourceMessageReceived', () => sseEvents++);
  for (const [path, target, open, inspect] of [
    ['/', 'Voldigoade', 'Ouvrir', 'Inspecter'],
    ['/en', 'Voldigoade/spoor', 'Open', 'Inspect'],
    ['/es', 'spoor-nonexistent-7f3a9c260e4b', 'Abrir', 'Inspeccionar'],
  ]) {
    await page.goto(base + path);
    await page.locator('astro-island[ssr]').waitFor({ state: 'detached' });
    await page.evaluate(() => document.fonts.ready);
    if (path === '/')
      await page
        .locator('h1')
        .evaluateAll((nodes) =>
          Promise.all(
            nodes.flatMap((node) =>
              node.getAnimations().map((animation) => animation.finished),
            ),
          ),
        );
    if (path === '/')
      await page.screenshot({ path: join(output, 'desktop-top.png') });
    await page.getByRole('button', { name: open, exact: true }).click();
    await page.locator('#spoor-target').fill(target);
    const reportResponse =
      path === '/es'
        ? null
        : page
            .waitForResponse((response) => response.url().endsWith('/report'), {
              timeout: 125000,
            })
            .catch(() => null);
    await page.getByRole('button', { name: inspect, exact: true }).click();
    await page
      .locator('.compact-report,.lookup-error[role="alert"]')
      .waitFor({ timeout: 125000 });
    const visible = await page.locator('#spoor').innerText();
    if (path === '/es') {
      assert.equal(await page.locator('.lookup-error').count(), 1);
      result.lookups.push({ target, error: true, visible });
      continue;
    }
    assert.equal(await page.locator('.compact-report').count(), 1);
    await page.waitForFunction(() => {
      const heading = document.querySelector('.report-heading h3');
      const bounds = heading?.getBoundingClientRect();
      return (
        document.querySelector('.spoor-shell').dataset.expanded === 'true' &&
        !document.querySelector('#spoor-content').inert &&
        bounds?.top >= 0 &&
        bounds.bottom < window.innerHeight
      );
    });
    await page.screenshot({
      path: join(
        output,
        path === '/' ? 'desktop-auto-reveal.png' : 'repository-auto-reveal.png',
      ),
    });
    const response = await reportResponse;
    assert.ok(response);
    const raw = await response.json();
    assert.equal(raw.schema_version, '1.1');
    result.lookups.push({
      target,
      schema: raw.schema_version,
      status: await page
        .locator('[data-report-status]')
        .getAttribute('data-report-status'),
      summary: raw.summary,
      coverage: raw.coverage,
      providers: raw.provider_status,
      warnings: raw.warnings,
      backend: raw.generator?.version,
      profile: raw.profile,
      identities: raw.identities?.filter(
        (identity) => identity.email_type !== 'git_hub_system',
      ),
    });
    await page.locator('#spoor').scrollIntoViewIfNeeded();
    await page.screenshot({
      path: join(
        output,
        path === '/' ? 'desktop-user-result.png' : 'desktop-repo-result.png',
      ),
    });
    if (path === '/') {
      await page.locator('.profile-avatar').waitFor();
      assert.equal(
        await page
          .locator('.profile-avatar')
          .evaluate((image) => image.complete && image.naturalWidth > 0),
        true,
      );
      await page.locator('.identity-evidence summary').click();
      const evidence = await page.locator('.observed-identities').innerText();
      for (const identity of raw.identities
        .filter((identity) => identity.email_type !== 'git_hub_system')
        .slice(0, 5))
        assert.ok(evidence.includes(identity.email));
      const expected = process.env.SPOOR_EXPECTED_IDENTITY;
      const enrichment = raw.provider_status.GitLeak?.status;
      if (expected && ['ok', 'cached'].includes(enrichment))
        assert.ok(
          evidence.includes(expected),
          'Available enrichment must reach the visible evidence section',
        );
      result.enrichment = {
        status: enrichment,
        expectedEvidenceVisible: expected
          ? evidence.includes(expected)
          : undefined,
      };
      await page
        .locator('#spoor')
        .screenshot({ path: join(output, 'desktop-user-evidence.png') });
      await page.getByRole('button', { name: 'Copier', exact: true }).click();
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      assert.match(copied, /Voldigoade\r?\nCompte GitHub/);
      assert.doesNotMatch(copied, /schema_version|provider_status/);
      result.copy = true;
      for (const width of [1440, 390]) {
        await page.setViewportSize({
          width,
          height: width === 390 ? 844 : 900,
        });
        await page
          .getByRole('button', { name: 'Réduire', exact: true })
          .click();
        await page.getByRole('button', { name: 'Ouvrir', exact: true }).click();
        assert.equal(await page.locator('.compact-report').count(), 1);
        assert.equal(
          await page.locator('#spoor-content').getAttribute('inert'),
          null,
        );
        for (const [label, format] of [
          ['PDF', 'pdf'],
          ['Markdown', 'md'],
          ['JSON', 'json'],
          ['TXT', 'txt'],
          ['SVG', 'svg'],
        ]) {
          await page
            .getByRole('button', { name: 'Exporter', exact: true })
            .click();
          const downloadPromise = page.waitForEvent('download', {
            timeout: 30000,
          });
          await page
            .getByRole('menuitem', { name: label, exact: true })
            .click();
          const download = await downloadPromise;
          const destination = join(output, `report-${width}.${format}`);
          await download.saveAs(destination);
          const bytes = await readFile(destination);
          assert.ok(bytes.length > 50);
          const text = bytes.toString('utf8');
          if (format === 'pdf')
            assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
          else if (format === 'json')
            assert.equal(JSON.parse(text).schema_version, '1.1');
          else if (format === 'svg') assert.match(text, /<svg[\s>]/);
          else assert.match(text, /Voldigoade/);
          result.exports.push({
            width,
            format,
            bytes: bytes.length,
            filename: download.suggestedFilename(),
            valid: true,
          });
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#spoor').scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(output, 'mobile-user-result.png') });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  }
  result.sseEvents = sseEvents;
  assert.ok(
    result.sse.some(
      (stream) =>
        stream.status === 200 && stream.type.includes('text/event-stream'),
    ),
  );
  assert.ok(sseEvents > 0);
  assert.deepEqual(result.errors, []);
  result.completed = true;
} finally {
  await writeFile(
    join(output, 'real-e2e.json'),
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      completed: result.completed,
      lookups: result.lookups.map(({ target, status, error }) => ({
        target,
        status,
        error,
      })),
      exports: result.exports,
      sseEvents: result.sseEvents,
      errors: result.errors,
      output,
    }),
  );
  await browser.close();
}
