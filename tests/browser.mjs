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
const errors = [];
const requests = new Set();
const report = {
  completed: false,
  layoutChecks: 0,
  accessibility: [],
  interactionLocales: [],
  motion: {},
  screenshots: [],
  errors,
  externalRequests: [],
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
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const translations = {
  fr: {
    home: '/',
    project: '/projets/secure-messaging',
    language: 'English',
    next: '/en',
    pause: 'Suspendre les animations',
    resume: 'Reprendre les animations',
  },
  en: {
    home: '/en',
    project: '/en/projects/secure-messaging',
    language: 'Español',
    next: '/es',
    pause: 'Pause animations',
    resume: 'Resume animations',
  },
  es: {
    home: '/es',
    project: '/es/proyectos/secure-messaging',
    language: 'Français',
    next: '/',
    pause: 'Pausar las animaciones',
    resume: 'Reanudar las animaciones',
  },
};

async function frames(page, count = 12) {
  return page.evaluate(
    (count) =>
      new Promise((resolve) => {
        let remaining = count;
        const step = () => {
          if (--remaining <= 0) resolve();
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }),
    count,
  );
}

async function capture(page, name, path, width, height, fullPage = false) {
  await page.setViewportSize({ width, height });
  await page.goto(base + path);
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator('.identity-content h1')
    .evaluateAll((nodes) =>
      Promise.all(
        nodes.flatMap((node) =>
          node.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  await page.screenshot({ path: join(output, `${name}.png`), fullPage });
  report.screenshots.push({ name, path, width, height });
}

async function sampleCanvas(page) {
  return page.locator('[data-signal-field] canvas').evaluate(async (canvas) => {
    const context = canvas.getContext('2d');
    const original = context.clearRect;
    const timestamps = [];
    context.clearRect = function (...args) {
      timestamps.push(performance.now());
      return original.apply(this, args);
    };
    const started = performance.now();
    try {
      await new Promise((resolve) => {
        let remaining = 120;
        const step = () => {
          if (--remaining <= 0) resolve();
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    } finally {
      context.clearRect = original;
    }
    const duration = performance.now() - started;
    const gaps = timestamps.slice(1).map((time, i) => time - timestamps[i]);
    gaps.sort((a, b) => a - b);
    return {
      renders: timestamps.length,
      framesPerSecond: Math.round((timestamps.length * 1000) / duration),
      medianFrameMs: Math.round(gaps[Math.floor(gaps.length / 2)] * 10) / 10,
      p95FrameMs: Math.round(gaps[Math.floor(gaps.length * 0.95)] * 10) / 10,
    };
  });
}

try {
  if (!process.env.PORTFOLIO_BASE_URL) {
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
      { stdio: 'ignore' },
    );
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null)
        throw new Error('Preview server exited before readiness');
      try {
        ready = (await fetch(base)).ok;
      } catch {
        ready = false;
      }
      if (ready) break;
      await delay(100);
    }
    assert.ok(ready, 'Preview server must start');
  }
  browser = await chromium.launch({
    channel: process.env.PORTFOLIO_BROWSER || 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  let expected404 = false;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !expected404) errors.push(message.text());
  });
  page.on('request', (request) => requests.add(request.url()));

  for (const path of routes) {
    for (const width of widths) {
      await page.setViewportSize({
        width,
        height: width === 390 ? 844 : width === 1280 ? 800 : 900,
      });
      const response = await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(response.status(), 200, path);
      const bounds = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll('h1').length,
        clipped: [...document.querySelectorAll('a, button')]
          .filter((node) => {
            const r = node.getBoundingClientRect();
            return (
              r.width > 0 && (r.left < -1 || r.right > window.innerWidth + 1)
            );
          })
          .map((node) => node.textContent.trim()),
      }));
      assert.ok(
        bounds.scrollWidth <= bounds.width,
        `${path} overflows at ${width}`,
      );
      assert.equal(bounds.h1, 1);
      assert.deepEqual(
        bounds.clipped,
        [],
        `${path} clipped controls at ${width}`,
      );
      report.layoutChecks++;
    }
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    report.accessibility.push({
      path,
      violations: audit.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        targets: item.nodes.map((node) => node.target),
      })),
    });
  }

  for (const [locale, t] of Object.entries(translations)) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + t.home);
    await page.locator('[data-layer-explorer][data-enhanced]').waitFor();
    const dimensions = page.locator('[data-research-controls] [role="tab"]');
    for (let i = 0; i < 4; i++) {
      await dimensions.nth(i).click();
      assert.equal(
        await dimensions.nth(i).getAttribute('aria-selected'),
        'true',
      );
      assert.equal(
        await page.locator('[data-research-question]:visible').count(),
        1,
      );
      assert.equal(
        await page
          .locator('[data-research-question]:visible')
          .getAttribute('data-research-question'),
        String(i),
      );
    }
    await dimensions.nth(3).press('Home');
    assert.equal(await dimensions.nth(0).getAttribute('aria-selected'), 'true');
    await dimensions.nth(0).press('ArrowLeft');
    assert.equal(await dimensions.nth(3).getAttribute('aria-selected'), 'true');
    const layers = page.locator('[data-layer-tabs] [role="tab"]');
    for (let i = 0; i < 5; i++) {
      await layers.nth(i).click();
      assert.equal(await page.locator('[data-layer-panel]:visible').count(), 1);
      assert.equal(
        await page
          .locator('[data-layer-panel]:visible')
          .getAttribute('data-layer-panel'),
        String(i),
      );
    }
    await layers.nth(4).press('Home');
    await layers.nth(0).press('ArrowRight');
    assert.equal(await layers.nth(1).getAttribute('aria-selected'), 'true');
    await page.getByRole('link', { name: t.language, exact: true }).click();
    assert.equal(new URL(page.url()).pathname, t.next);
    assert.equal(new URL(page.url()).hash, '#layer-systems');
    await page.locator('[data-layer-explorer][data-enhanced]').waitFor();
    assert.equal(
      await page
        .locator('[data-layer-index="1"]')
        .getAttribute('aria-selected'),
      'true',
    );
    await page.goto(base + t.project);
    await page.getByRole('link', { name: t.language, exact: true }).click();
    assert.ok(new URL(page.url()).pathname.includes('secure-messaging'));
    report.interactionLocales.push(locale);
  }

  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').getAttribute('class'), 'skip-link');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  await page.goto(base);
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-signal-field]')
        ?.getAttribute('data-ready') === 'true',
  );
  const canvas = page.locator('[data-signal-field] canvas');
  const first = await canvas.evaluate((canvas) => canvas.toDataURL());
  await frames(page, 24);
  const moving = await canvas.evaluate((canvas) => canvas.toDataURL());
  assert.notEqual(first, moving, 'Ambient field must actually animate');
  await page
    .getByRole('button', { name: translations.fr.pause, exact: true })
    .click();
  const paused = await canvas.evaluate((canvas) => canvas.toDataURL());
  await frames(page, 24);
  assert.equal(
    await canvas.evaluate((canvas) => canvas.toDataURL()),
    paused,
    'Pause must stop canvas drawing',
  );
  await page
    .getByRole('button', { name: translations.fr.resume, exact: true })
    .click();
  await frames(page, 24);
  assert.notEqual(
    await canvas.evaluate((canvas) => canvas.toDataURL()),
    paused,
    'Resume must restart the field',
  );
  await page.locator('#areas').scrollIntoViewIfNeeded();
  await frames(page, 30);
  const offscreen = await canvas.evaluate((canvas) => canvas.toDataURL());
  await frames(page, 24);
  assert.equal(
    await canvas.evaluate((canvas) => canvas.toDataURL()),
    offscreen,
    'Offscreen canvas must stop',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await frames(page, 8);
  const reduced = await canvas.evaluate((canvas) => canvas.toDataURL());
  await frames(page, 24);
  assert.equal(await canvas.evaluate((canvas) => canvas.toDataURL()), reduced);
  assert.equal(await page.locator('[data-motion-toggle]').isVisible(), false);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    'auto',
  );
  assert.equal(await page.locator('h1').isVisible(), true);
  await page.locator('[data-layer-index="3"]').click();
  assert.equal(await page.locator('[data-layer-panel="3"]').isVisible(), true);
  report.motion = {
    animated: true,
    pause: true,
    resume: true,
    offscreenSuspension: true,
    reducedMotion: true,
  };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base);
  await page.locator('[data-signal-field][data-ready]').waitFor();
  report.motion.desktopSample = await sampleCanvas(page);

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });
  const touch = await touchContext.newPage();
  await touch.goto(base);
  await touch.locator('[data-signal-field][data-ready]').waitFor();
  report.motion.mobileSample = await sampleCanvas(touch);
  assert.ok(
    await touch
      .locator('[data-signal-field] canvas')
      .evaluate((canvas) => canvas.width <= 390 * 1.5),
    'Mobile canvas must cap device pixel ratio',
  );
  for (let i = 0; i < 5; i++) {
    await touch.locator(`[data-layer-index="${i}"]`).tap();
    assert.equal(
      await touch.locator(`[data-layer-panel="${i}"]`).isVisible(),
      true,
    );
  }
  report.motion.touchSelection = true;
  await touchContext.close();
  await page.emulateMedia({
    reducedMotion: 'no-preference',
    forcedColors: 'active',
  });
  assert.equal(await page.locator('[data-layer-index="3"]').isVisible(), true);
  await page.emulateMedia({ forcedColors: 'none' });

  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await noJsContext.newPage();
  await noJs.goto(base);
  assert.equal(await noJs.locator('[data-layer-panel]:visible').count(), 5);
  await noJs.locator('.node-metadata').click();
  assert.ok(noJs.url().endsWith('/projets/secure-messaging#dimension-1'));
  await noJsContext.close();

  expected404 = true;
  const missing = await page.goto(base + '/missing-page');
  assert.equal(missing.status(), 404);
  expected404 = false;
  for (const path of ['/en/404', '/es/404']) {
    await page.goto(base + path);
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute('content'),
      'noindex,follow',
    );
  }

  for (const [name, path, width, height, full] of [
    ['hero-1440', '/', 1440, 900, false],
    ['hero-1280', '/', 1280, 800, false],
    ['hero-mobile', '/', 390, 844, false],
    ['home-desktop', '/', 1440, 900, true],
    ['home-mobile', '/', 390, 844, true],
    ['home-mobile-es', '/es', 320, 844, true],
    ['project-desktop', '/projets/secure-messaging', 1440, 900, true],
  ])
    await capture(page, name, path, width, height, full);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page
    .getByRole('button', { name: translations.fr.pause, exact: true })
    .click();
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.locator('#work').screenshot({ path: join(output, 'work.png') });
  await page.locator('#areas').scrollIntoViewIfNeeded();
  await page.locator('#areas').screenshot({ path: join(output, 'layers.png') });
  report.externalRequests = [...requests].filter(
    (url) => !url.startsWith(base),
  );
  assert.deepEqual(report.externalRequests, []);
  assert.equal((await context.cookies()).length, 0);
  assert.equal(errors.length, 0, 'Unexpected browser errors');
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
  console.log(JSON.stringify(report));
  await browser?.close();
  server?.kill();
}
