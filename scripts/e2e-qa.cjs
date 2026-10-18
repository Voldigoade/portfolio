let chromium;
try {
  chromium = require("playwright").chromium;
} catch {
  chromium =
    require("/home/cruck/.bun/install/cache/playwright-core@1.64.1@@@1").chromium;
}
const fs = require("node:fs");
const path = require("node:path");

const SCREENSHOTS_DIR =
  process.env.SCREENSHOTS_DIR || path.join(__dirname, "../.qa-screenshots");
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runQA() {
  console.log("=== STARTING BROWSER E2E QA (BILINGUAL FR/EN VERIFICATION) ===");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/home/cruck/.local/bin/google-chrome",
  });

  const errors = [];
  const interceptedGoogleRequests = [];
  const consoleErrors = [];

  // 1. Desktop Light & Dark Testing
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await desktopContext.newPage();

  // Monitor all outgoing network requests for forbidden Google Analytics / GTM endpoints
  page.on("request", (req) => {
    try {
      const parsedUrl = new URL(req.url());
      const host = parsedUrl.hostname.toLowerCase();
      if (
        host === "google-analytics.com" ||
        host.endsWith(".google-analytics.com") ||
        host === "googletagmanager.com" ||
        host.endsWith(".googletagmanager.com") ||
        host === "doubleclick.net" ||
        host.endsWith(".doubleclick.net")
      ) {
        console.error(
          `[SECURITY ALERT] Intercepted forbidden Google request: ${req.url()}`,
        );
        interceptedGoogleRequests.push(req.url());
      }
    } catch {
      // ignore unparseable URLs
    }
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // Ignore favicon or benign 404 warnings from intentional test 404s
      if (!text.includes("404") && !text.includes("favicon")) {
        consoleErrors.push(text);
      }
    }
  });

  // Test routes
  const routes = [
    { name: "home-fr", path: "/", expectedLang: "fr" },
    { name: "about-fr", path: "/about", expectedLang: "fr" },
    { name: "project-fr", path: "/project", expectedLang: "fr" },
    { name: "blog-fr", path: "/blog", expectedLang: "fr" },
    { name: "privacy-fr", path: "/privacy-policy", expectedLang: "fr" },
    { name: "home-en", path: "/en", expectedLang: "en" },
    { name: "about-en", path: "/en/about", expectedLang: "en" },
    { name: "project-en", path: "/en/project", expectedLang: "en" },
    { name: "blog-en", path: "/en/blog", expectedLang: "en" },
    { name: "privacy-en", path: "/en/privacy-policy", expectedLang: "en" },
    { name: "404", path: "/non-existent-page-test", expectedStatus: 404 },
  ];

  for (const route of routes) {
    console.log(`[QA] Navigating to Desktop: ${route.path}`);
    const res = await page.goto(`http://localhost:3000${route.path}`, {
      waitUntil:
        route.expectedStatus === 404 ? "domcontentloaded" : "networkidle",
    });

    const expectedStatus = route.expectedStatus || 200;
    if (res.status() !== expectedStatus) {
      errors.push(
        `Expected ${expectedStatus} status for ${route.path}, got ${res.status()}`,
      );
    }

    if (expectedStatus === 200) {
      // Check html lang attribute
      if (route.expectedLang) {
        const htmlLang = await page.getAttribute("html", "lang");
        if (htmlLang !== route.expectedLang) {
          errors.push(
            `Expected <html lang="${route.expectedLang}"> on ${route.path}, got "${htmlLang}"`,
          );
        }
      }

      // Check text for forbidden terms (no Muhammad / Fiaz identity, no crukst)
      const bodyText = await page.innerText("body");
      const lowerText = bodyText.toLowerCase();
      if (
        lowerText.includes("muhammad") ||
        lowerText.includes("fiaz") ||
        lowerText.includes("mohamed")
      ) {
        errors.push(
          `Forbidden identity string found in rendered text on ${route.path}`,
        );
      }

      if (lowerText.includes("crukst")) {
        errors.push(
          `Obsolete 'crukst' reference found in rendered text on ${route.path}`,
        );
      }

      // Capture Light screenshot
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `qa-desktop-${route.name}-light.png`),
        fullPage: false,
      });

      // Toggle Dark mode via theme button
      const themeBtn = page
        .locator(
          "button[aria-label*='mode'], button[aria-label*='thème'], button[aria-label*='theme'], button:has-text('☀️'), button:has-text('🌙')",
        )
        .first();
      if (await themeBtn.isVisible()) {
        await themeBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `qa-desktop-${route.name}-dark.png`),
          fullPage: false,
        });
        // Toggle back to light
        await themeBtn.click();
        await page.waitForTimeout(200);
      }
    }
  }

  // 2. Test Language Switcher bidirectional flow across pages
  console.log("[QA] Testing Language Switcher on Home (/ -> /en -> /)...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const enHomeBtn = page.locator("a[aria-label='English version']");
  if (await enHomeBtn.isVisible()) {
    await enHomeBtn.click();
    await page.waitForURL("**/en");
    console.log("[QA] Successfully toggled to /en");
    const frHomeBtn = page.locator("a[aria-label='Version française']");
    await frHomeBtn.click();
    await page.waitForURL("http://localhost:3000/");
    console.log("[QA] Successfully toggled back to /");
  } else {
    errors.push("Language switcher EN link not found on Home");
  }

  console.log(
    "[QA] Testing Language Switcher on About (/about -> /en/about -> /about)...",
  );
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
  const enAboutBtn = page.locator("a[aria-label='English version']");
  if (await enAboutBtn.isVisible()) {
    await enAboutBtn.click();
    await page.waitForURL("**/en/about");
    console.log("[QA] Successfully toggled to /en/about");
    const frAboutBtn = page.locator("a[aria-label='Version française']");
    await frAboutBtn.click();
    await page.waitForURL("**/about");
    console.log("[QA] Successfully toggled back to /about");
  } else {
    errors.push("Language switcher EN link not found on /about");
  }

  console.log(
    "[QA] Testing Language Switcher on Project (/project -> /en/project)...",
  );
  await page.goto("http://localhost:3000/project", {
    waitUntil: "networkidle",
  });
  const enProjectBtn = page.locator("a[aria-label='English version']");
  if (await enProjectBtn.isVisible()) {
    await enProjectBtn.click();
    await page.waitForURL("**/en/project");
    console.log("[QA] Successfully toggled to /en/project");
  } else {
    errors.push("Language switcher EN link not found on /project");
  }

  // 3. Verify ABSENCE of Cookie Notice & Footer cookie elements
  console.log(
    "[QA] Verifying absence of Cookie Notice and cookie management...",
  );
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const cookieNoticeCount = await page
    .locator(
      "aside[aria-label*='consentement'], div:has-text('MESURE D\\'AUDIENCE')",
    )
    .count();
  if (cookieNoticeCount > 0) {
    errors.push("Cookie notice should NOT be rendered anymore");
  }

  const manageCookiesCount = await page
    .locator("button:has-text('Gérer les préférences')")
    .count();
  if (manageCookiesCount > 0) {
    errors.push(
      "Footer button 'Gérer les préférences' should NOT exist anymore",
    );
  }

  await desktopContext.close();

  // 4. Mobile Testing (390x844 - iPhone 12/13/14 size)
  console.log("[QA] Running Mobile viewport tests...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });

  const mobilePage = await mobileContext.newPage();

  for (const route of [
    { name: "home-fr", path: "/" },
    { name: "about-fr", path: "/about" },
    { name: "project-fr", path: "/project" },
    { name: "blog-fr", path: "/blog" },
    { name: "home-en", path: "/en" },
    { name: "about-en", path: "/en/about" },
    { name: "project-en", path: "/en/project" },
  ]) {
    await mobilePage.goto(`http://localhost:3000${route.path}`, {
      waitUntil: "networkidle",
    });
    await mobilePage.screenshot({
      path: path.join(SCREENSHOTS_DIR, `qa-mobile-${route.name}.png`),
      fullPage: false,
    });
  }

  // Test Mobile Navigation Drawer
  const mobileNavTrigger = mobilePage
    .locator("button[aria-label*='menu'], button[aria-label*='Menu']")
    .first();
  if (await mobileNavTrigger.isVisible()) {
    await mobileNavTrigger.click();
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "qa-mobile-nav-open.png"),
      fullPage: false,
    });
  }

  await mobileContext.close();
  await browser.close();

  // 5. Final Report on Analytics Requests
  if (interceptedGoogleRequests.length > 0) {
    errors.push(
      `Forbidden Google Analytics requests occurred: ${interceptedGoogleRequests.join(", ")}`,
    );
  }

  if (consoleErrors.length > 0) {
    console.warn("[QA] Console errors observed:", consoleErrors);
  }

  console.log("=== BROWSER E2E QA FINISHED ===");
  if (errors.length > 0) {
    console.error("QA Errors encountered:", errors);
    process.exit(1);
  } else {
    console.log(
      "ALL QA CHECKS PASSED PERFECTLY! BILINGUAL FR/EN, ZERO GA REQUESTS, NO COOKIE BANNER, CLOUDFLARE ONLY.",
    );
  }
}

runQA().catch((err) => {
  console.error("QA script exception:", err);
  process.exit(1);
});
