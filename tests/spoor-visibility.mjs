import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';
import { fixture } from './fixtures/spoor-report.mjs';

const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4326';
const output =
  process.env.PORTFOLIO_QA_OUTPUT || join(tmpdir(), 'spoor-visibility');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const checks = [];
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const api = 'https://api--spoor--xsw6djgrvwtl.code.run';
  let scenario, polls, reports, streamed, releaseReport, reportPendingResolve;
  let sequence = 0;
  const json = (value, status = 200) => ({
    status,
    contentType: 'application/json',
    body: JSON.stringify(value),
    headers: { 'Access-Control-Allow-Origin': new URL(base).origin },
  });
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
      assert.equal(request.postDataJSON().enrich, true);
      assert.equal(request.postDataJSON().mode, 'fast');
      sequence++;
      return route.fulfill(
        json(
          {
            id: `lookup-${sequence}`,
            status: ['cached', 'partial', 'repository'].includes(scenario)
              ? 'completed'
              : 'pending',
          },
          202,
        ),
      );
    }
    if (path.endsWith('/events')) {
      streamed = true;
      if (scenario !== 'sse') return route.abort();
      return route.fulfill({
        contentType: 'text/event-stream',
        headers: { 'Access-Control-Allow-Origin': new URL(base).origin },
        body: 'event: provider.completed\ndata: {"data":{"provider":"GitHub","details":"Profile ready"}}\n\nevent: analysis.completed\ndata: {"data":{"duration_ms":1}}\n\n',
      });
    }
    if (path.endsWith('/report')) {
      reports++;
      if (scenario === 'minimized')
        await new Promise((resolve) => {
          releaseReport = resolve;
          reportPendingResolve();
        });
      if (scenario === 'report-retry' && reports < 3)
        return route.fulfill(
          json({ code: 'in_progress' }, reports === 1 ? 202 : 503),
        );
      return route.fulfill(
        json({
          ...fixture,
          target: { type: scenario === 'repository' ? 'repo' : 'user' },
          summary: { ...fixture.summary, display_name: `Result ${sequence}` },
          profile: undefined,
          coverage: { ...fixture.coverage, is_partial: scenario === 'partial' },
        }),
      );
    }
    polls++;
    const failures =
      scenario === 'one-failure' ? 1 : scenario === 'multiple-failures' ? 3 : 0;
    if (polls <= failures)
      return route.fulfill(json({ code: 'internal_error' }, 503));
    return route.fulfill(
      json({
        id: `lookup-${sequence}`,
        status: scenario === 'sse' && !streamed ? 'running' : 'completed',
      }),
    );
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(base);
    await page.locator('astro-island[ssr]').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Ouvrir', exact: true }).click();
    for (scenario of [
      'sse',
      'before-subscription',
      'disconnect',
      'one-failure',
      'multiple-failures',
      'cached',
      'report-retry',
      'partial',
      'repository',
      'minimized',
      'cached',
    ]) {
      polls = 0;
      reports = 0;
      streamed = false;
      releaseReport = undefined;
      const reportPending = new Promise((resolve) => {
        reportPendingResolve = resolve;
      });
      await page
        .locator('#spoor-target')
        .fill(scenario === 'repository' ? 'example/repo' : 'example');
      await page
        .getByRole('button', { name: 'Inspecter', exact: true })
        .click();
      if (scenario === 'minimized') {
        await reportPending;
        await page
          .getByRole('button', { name: 'Réduire', exact: true })
          .click();
        await page.waitForFunction(
          () =>
            document.querySelector('.spoor-shell').dataset.expanded === 'false',
        );
        assert.ok(releaseReport);
        releaseReport();
      }
      await page.locator('.compact-report').waitFor({ timeout: 30000 });
      await page.waitForFunction(() => {
        const heading = document.querySelector('.report-heading h3');
        const bounds = heading?.getBoundingClientRect();
        return (
          document.querySelector('.spoor-shell').dataset.expanded === 'true' &&
          bounds?.top >= 0 &&
          bounds.bottom < window.innerHeight
        );
      });
      assert.equal(
        await page.locator('#spoor-content').getAttribute('aria-hidden'),
        'false',
      );
      assert.equal(
        await page.locator('#spoor-content').getAttribute('inert'),
        null,
      );
      assert.equal(
        await page.locator('.report-heading h3').innerText(),
        `Result ${sequence}`,
      );
      assert.equal(await page.locator('.lookup-error').count(), 0);
      assert.equal(reports, scenario === 'report-retry' ? 3 : 1);
      await page.getByRole('button', { name: 'Réduire', exact: true }).click();
      await page.getByRole('button', { name: 'Ouvrir', exact: true }).click();
      assert.equal(await page.locator('.compact-report').count(), 1);
      checks.push({ width, scenario, polls, reports, visible: true });
      if (scenario === 'minimized')
        await page.screenshot({
          path: join(output, `reopened-result-${width}.png`),
        });
    }
  }
  await context.close();
} finally {
  await writeFile(
    join(output, 'visibility.json'),
    JSON.stringify(checks, null, 2),
  );
  console.log(JSON.stringify({ checks: checks.length, output }));
  await browser.close();
}
