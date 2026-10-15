import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4325';
const output =
  process.env.PORTFOLIO_QA_OUTPUT ||
  (await mkdtemp(join(tmpdir(), 'portfolio-browser-')));
await mkdir(output, { recursive: true });
let server;
let browser;
const report = {
  completed: false,
  layoutChecks: 0,
  accessibility: [],
  errors: [],
  screenshots: [],
  motion: {},
  interactions: [],
};
const routes = [
  '/',
  '/en',
  '/es',
  '/projets/secure-messaging',
  '/en/projects/secure-messaging',
  '/es/proyectos/secure-messaging',
  '/confidentialite',
  '/en/privacy',
  '/es/privacidad',
];
const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const api = 'https://api--spoor--xsw6djgrvwtl.code.run';
const fixture = {
  schema_version: '1.1',
  target: { type: 'user' },
  summary: {
    display_name: 'Browser test',
    total_public_repositories: 8,
    distinct_emails_observed: 1,
    public_keys_found: 2,
    account_created: '2025-01-01T00:00:00Z',
    primary_languages: [
      ['Rust', 50],
      ['TypeScript', 25],
      ['Python', 25],
    ],
  },
  coverage: {
    is_partial: false,
    commits_scanned: 30,
    repositories_scanned: 3,
    repositories_total: 8,
  },
  profile: {
    login: 'example',
    name: 'Browser test',
    bio: 'Public profile biography.',
    followers: 12,
    html_url: 'https://github.com/example',
    avatar_url: 'https://avatars.githubusercontent.com/u/1',
  },
  identities: [
    {
      email: 'observed@example.invalid',
      email_type: 'domain_email',
      name: 'Observed name',
      sources: ['Public Git Commit Metadata'],
      repositories: ['example/repository-with-a-long-name'],
      first_seen: '2025-01-01T00:00:00Z',
      last_seen: '2026-10-01T00:00:00Z',
    },
  ],
  activity: {
    total_events_observed: 24,
    active_repositories: ['example/repo'],
    recent_actions: [{ created_at: '2026-10-01T00:00:00Z' }],
  },
  provider_status: { github: { status: 'cached' }, GitLeak: { status: 'ok' } },
  repositories: [{ languages: null, hygiene: null }],
};
const json = (value, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(value),
  headers: { 'Access-Control-Allow-Origin': new URL(base).origin },
});
async function settled(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.locator('astro-island[ssr]').waitFor({ state: 'detached' });
  await page
    .locator('.identity-content h1')
    .evaluateAll((nodes) =>
      Promise.all(
        nodes.flatMap((node) =>
          node.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
}
async function audit(page, state) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  report.accessibility.push({
    state,
    violations: result.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((node) => node.target),
    })),
  });
}
async function capture(page, name, fullPage = false) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) =>
          Number.isFinite(animation.effect?.getTiming().iterations),
        )
        .map((animation) => animation.finished.catch(() => {})),
    ),
  );
  await page.screenshot({ path: join(output, `${name}.png`), fullPage });
  report.screenshots.push(name);
}
async function assertLayout(page) {
  const bad = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [
      ...document.querySelectorAll(
        'h1,h2,h3,p,button,input,dt,dd,.floating-nav,.languages',
      ),
    ]
      .filter((node) => {
        if (node.closest('[inert]')) return false;
        const bounds = node.getBoundingClientRect();
        return (
          bounds.width > 0 && (bounds.right > width + 1 || bounds.left < -1)
        );
      })
      .map((node) => ({
        tag: node.tagName,
        text: node.textContent?.slice(0, 60),
      }));
  });
  assert.deepEqual(bad, [], 'Content exceeds viewport');
  report.layoutChecks++;
}
try {
  if (!process.env.PORTFOLIO_BASE_URL) {
    let serverOutput = '';
    server = spawn(
      process.execPath,
      [
        'node_modules/astro/bin/astro.mjs',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '4325',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    server.stdout.on('data', (data) => {
      serverOutput = (serverOutput + data).slice(-4000);
    });
    server.stderr.on('data', (data) => {
      serverOutput = (serverOutput + data).slice(-4000);
    });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) break;
      try {
        if ((await fetch(base)).ok) {
          ready = true;
          break;
        }
      } catch {
        ready = false;
      }
      await delay(100);
    }
    assert.ok(ready, `Preview did not become ready: ${serverOutput}`);
  }
  browser = await chromium.launch({
    channel: process.env.PORTFOLIO_BROWSER || 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('status of 404'))
      report.errors.push(message.text());
  });
  const external = new Set();
  page.on('request', (request) => {
    if (!request.url().startsWith(new URL(base).origin))
      external.add(request.url());
  });
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of routes) {
      assert.equal((await page.goto(base + path)).status(), 200);
      await settled(page);
      assert.equal(await page.title(), 'Voldigoade');
      assert.equal(await page.locator('h1').count(), 1);
      await assertLayout(page);
      if (viewport.width === 390 || viewport.width === 1440)
        await audit(page, `${path}:${viewport.width}`);
    }
    await page.goto(base);
    await settled(page);
    await capture(page, `top-${viewport.width}`);
  }
  assert.deepEqual([...external], [], 'Idle portfolio sends external requests');
  assert.equal(
    await page.locator('button[aria-label*="animation"]').count(),
    0,
  );
  assert.equal(
    await page
      .locator('button')
      .filter({ hasText: /démo|fixture/i })
      .count(),
    0,
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await settled(page);
  await page.keyboard.press('Tab');
  assert.equal(
    await page
      .locator('.skip-link')
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await page.keyboard.press('Enter');
  assert.ok(page.url().endsWith('#main'));
  await page
    .locator('.floating-nav')
    .getByRole('link', { name: 'Spoor', exact: true })
    .click();
  assert.equal(
    await page
      .getByRole('button', { name: 'Réduire', exact: true })
      .getAttribute('aria-expanded'),
    'true',
  );
  assert.equal(
    await page
      .locator('#spoor-target')
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await capture(page, 'focused-input');
  await page.locator('#spoor-target').scrollIntoViewIfNeeded();
  await capture(page, 'focused-field');
  assert.equal(
    await page
      .locator('#spoor-target')
      .evaluate((node) => getComputedStyle(node).outlineStyle),
    'none',
  );
  assert.deepEqual(
    await page
      .locator('.lookup-input [data-surface="field"]')
      .evaluate((node) => ({
        outline: getComputedStyle(node).outlineWidth,
        offset: getComputedStyle(node).outlineOffset,
        shadow: getComputedStyle(node).boxShadow,
      })),
    { outline: '2px', offset: '-1px', shadow: 'none' },
  );
  await page
    .locator('#spoor-target')
    .fill('https://example.invalid/not-github');
  await page.locator('#spoor-target').press('Enter');
  assert.equal(
    await page.locator('#spoor-target').getAttribute('aria-invalid'),
    'true',
  );
  assert.equal(
    await page
      .locator('#spoor-target')
      .evaluate((node) => node === document.activeElement),
    true,
  );
  let scenario = 'complete';
  let releaseFirst;
  let polls = 0;
  let exportRelease;
  await page.route('https://avatars.githubusercontent.com/**', (route) =>
    route.fulfill({
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jOUcAAAAASUVORK5CYII=',
        'base64',
      ),
    }),
  );
  await page.route(api + '/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.method() === 'OPTIONS')
      return route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': new URL(base).origin,
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'content-type',
        },
      });
    if (request.method() === 'POST') {
      assert.equal(request.postDataJSON().mode, 'fast');
      assert.equal(request.postDataJSON().enrich, true);
      if (scenario === 'network') return route.abort('failed');
      if (scenario === 'stale') {
        await new Promise((resolve) => {
          releaseFirst = resolve;
        });
        return route
          .fulfill(json({ id: 'stale', status: 'completed' }, 202))
          .catch(() => {});
      }
      if (['429', '404', '409', '422', '500'].includes(scenario))
        return route.fulfill(
          json(
            { code: scenario === '429' ? 'rate_limit_exceeded' : 'test_error' },
            Number(scenario),
          ),
        );
      return route.fulfill(
        json(
          {
            id: 'test',
            status: ['loading', 'recovery'].includes(scenario)
              ? 'pending'
              : 'completed',
          },
          202,
        ),
      );
    }
    if (path.endsWith('/events'))
      return route.fulfill({
        status: 503,
        body: '',
        headers: { 'Access-Control-Allow-Origin': new URL(base).origin },
      });
    if (path.endsWith('/report'))
      return route.fulfill(
        json({
          ...fixture,
          coverage: { ...fixture.coverage, is_partial: scenario === 'partial' },
          provider_status:
            scenario === 'enrichmentUnavailable'
              ? { github: { status: 'ok' }, GitLeak: { status: 'unavailable' } }
              : fixture.provider_status,
          warnings: scenario === 'warning' ? ['test warning'] : [],
        }),
      );
    if (path.includes('/export/')) {
      if (scenario === 'exportBusy')
        await new Promise((resolve) => {
          exportRelease = resolve;
        });
      return route.fulfill(json({ code: 'internal_error' }, 500));
    }
    if (scenario === 'recovery') {
      polls++;
      if (polls === 1) return route.abort('failed');
      if (polls === 2)
        return route.fulfill(json({ code: 'internal_error' }, 503));
      return route.fulfill(
        json({ id: 'test', status: polls >= 4 ? 'completed' : 'running' }),
      );
    }
    return route.fulfill(json({ id: 'test', status: 'running' }));
  });
  const submit = async (value = 'Voldigoade') => {
    await page.locator('#spoor-target').fill(value);
    await page.locator('#spoor-target').press('Enter');
  };
  for (const failure of ['429', '404', '409', '422', '500', 'network']) {
    scenario = failure;
    await submit();
    await page.locator('.lookup-error[role="alert"]').waitFor();
    assert.equal(await page.locator('.compact-report').count(), 0);
    assert.equal(
      await page
        .getByRole('button', { name: 'Inspecter', exact: true })
        .isEnabled(),
      true,
    );
    report.interactions.push(`HTTP ${failure} recoverable`);
    if (failure === '429') {
      await capture(page, 'rate-limit');
      await audit(page, 'rate-limit');
    }
  }
  scenario = 'loading';
  await submit();
  await page.locator('[aria-busy="true"]').waitFor();
  await capture(page, 'loading');
  await audit(page, 'loading');
  await page.getByRole('button', { name: 'Annuler', exact: true }).click();
  assert.equal(await page.locator('[aria-busy="true"]').count(), 0);
  scenario = 'recovery';
  await submit();
  await page.getByText('Reconnexion…', { exact: true }).first().waitFor();
  await capture(page, 'sse-recovery');
  await page.locator('.compact-report').waitFor();
  assert.ok(polls >= 4);
  report.interactions.push(
    'SSE disconnect + network/503 status failures recovered',
  );
  scenario = 'stale';
  await submit('old-target');
  await page.getByRole('button', { name: 'Annuler', exact: true }).click();
  scenario = 'complete';
  await submit('new-target');
  await page.locator('.compact-report').waitFor();
  releaseFirst();
  assert.equal(
    await page.locator('.report-heading h3').innerText(),
    'Browser test',
  );
  report.interactions.push('cancelled/stale request ignored');
  for (const state of [
    'complete',
    'partial',
    'enrichmentUnavailable',
    'warning',
  ]) {
    scenario = state;
    await submit();
    await page.locator('.compact-report').waitFor();
    await audit(page, state);
    if (['partial', 'enrichmentUnavailable'].includes(state))
      await capture(page, state);
    if (state === 'partial')
      assert.equal(
        await page
          .locator('[data-report-status]')
          .getAttribute('data-report-status'),
        'partial',
      );
    if (state === 'warning')
      assert.equal(await page.locator('.partial-notice').count(), 1);
  }
  await page.getByRole('button', { name: 'Copier', exact: true }).click();
  await page.locator('.identity-evidence summary').click();
  assert.match(
    await page.locator('.observed-identities').innerText(),
    /observed@example.invalid/,
  );
  await audit(page, 'rich-identities');
  assert.match(
    await page.evaluate(() => navigator.clipboard.readText()),
    /Browser test\r?\nCompte GitHub/,
  );
  await page
    .getByRole('button', { name: 'Exporter', exact: true })
    .press('ArrowDown');
  await page.getByRole('menu').waitFor();
  assert.equal(await page.getByRole('menuitem').count(), 5);
  await page.keyboard.press('End');
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    'SVG',
  );
  await capture(page, 'export-menu');
  await audit(page, 'export-menu');
  await page.keyboard.press('Escape');
  assert.equal(
    await page
      .getByRole('button', { name: 'Exporter', exact: true })
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await page
    .getByRole('button', { name: 'Exporter', exact: true })
    .press('ArrowUp');
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    'SVG',
  );
  await page.keyboard.press('Home');
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    'PDF',
  );
  await page.locator('.report-heading h3').click();
  assert.equal(await page.getByRole('menu').count(), 0);
  assert.equal(
    await page
      .getByRole('button', { name: 'Exporter', exact: true })
      .evaluate((node) => node === document.activeElement),
    true,
  );
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.locator('#spoor').scrollIntoViewIfNeeded();
    await assertLayout(page);
    await capture(page, `result-${viewport.width}`);
    await page.getByRole('button', { name: 'Exporter', exact: true }).click();
    await assertLayout(page);
    const menu = await page.getByRole('menu').boundingBox();
    assert.ok(
      menu.x >= 0 && menu.x + menu.width <= viewport.width && menu.height < 280,
    );
    assert.equal(
      await page
        .getByRole('menu')
        .evaluate((node) => node.scrollHeight <= node.clientHeight),
      true,
    );
    await capture(page, `export-${viewport.width}`);
    await page.keyboard.press('Escape');
  }
  scenario = 'exportBusy';
  await page.getByRole('button', { name: 'Exporter', exact: true }).click();
  await page.getByRole('menuitem', { name: 'PDF', exact: true }).click();
  await page.locator('.report-actions button[aria-busy="true"]').waitFor();
  await capture(page, 'export-busy');
  await audit(page, 'export-busy');
  exportRelease();
  await page.locator('.export-control [role="alert"]').waitFor();
  await capture(page, 'export-error');
  await audit(page, 'export-error');
  await page.getByRole('button', { name: 'Réduire', exact: true }).click();
  assert.equal(await page.locator('#spoor-content').getAttribute('inert'), '');
  await page.getByRole('button', { name: 'Ouvrir', exact: true }).click();
  assert.equal(await page.locator('.compact-report').count(), 1);
  await context.unroute(api + '/**');
  await page.goto(base + '#about');
  await settled(page);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await settled(page);
  assert.equal(page.url(), base + '/en#about');
  await page.getByRole('link', { name: 'Español', exact: true }).click();
  await settled(page);
  assert.equal(page.url(), base + '/es#about');
  for (const path of ['/missing-page', '/en/404', '/es/404']) {
    const response = await page.goto(base + path);
    if (path === '/missing-page') assert.equal(response.status(), 404);
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute('content'),
      'noindex,follow',
    );
    await audit(page, path);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await settled(page);
  assert.equal(
    await page.locator('html').getAttribute('data-motion'),
    'paused',
  );
  report.motion.reduced = true;
  await page.emulateMedia({ forcedColors: 'active' });
  assert.equal(await page.locator('h1').isVisible(), true);
  report.motion.forcedColors = true;
  assert.deepEqual(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
    { local: 0, session: 0 },
  );
  assert.equal((await context.cookies()).length, 0);
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(base);
  await settled(touchPage);
  await touchPage.getByRole('button', { name: 'Ouvrir', exact: true }).tap();
  assert.equal(
    await touchPage.locator('#spoor-content').getAttribute('aria-hidden'),
    'false',
  );
  await touch.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator('#about').isVisible(), true);
  assert.equal(await staticPage.locator('.areas-grid .area').count(), 6);
  await noJs.close();
  assert.deepEqual(
    report.errors.filter(
      (message) =>
        !message.includes('net::ERR_FAILED') &&
        !/status of (429|409|422|500|503)/.test(message),
    ),
    [],
  );
  assert.ok(
    report.accessibility.every((audit) => audit.violations.length === 0),
    'Accessibility violations',
  );
  report.completed = true;
} finally {
  await writeFile(
    join(output, 'results.json'),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify({ ...report, output }));
  await browser?.close();
  server?.kill();
}
