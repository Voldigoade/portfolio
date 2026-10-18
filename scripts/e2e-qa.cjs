const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const SCREENSHOTS_DIR =
  "/home/cruck/.gemini/antigravity/brain/83f26293-bb20-4307-ac17-bd7f18f9ffa9/qa_screenshots";
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runQA() {
  console.log("=== STARTING BROWSER E2E QA (CLOUDFLARE ONLY / NO GA) ===");
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
    const url = req.url().toLowerCase();
    if (
      url.includes("google-analytics.com") ||
      url.includes("googletagmanager.com") ||
      url.includes("doubleclick.net")
    ) {
      console.error(
        `[SECURITY ALERT] Intercepted forbidden Google request: ${url}`,
      );
      interceptedGoogleRequests.push(url);
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
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "project", path: "/project" },
    { name: "blog-fr", path: "/blog" },
    { name: "article-fr", path: "/blog/introduction-projets-voldigoade" },
    { name: "blog-en", path: "/en/blog" },
    {
      name: "article-en",
      path: "/en/blog/introduction-to-voldigoade-projects",
    },
    { name: "privacy", path: "/privacy-policy" },
    {
      name: "deleted-cookies-policy",
      path: "/cookies-policy",
      expectedStatus: 404,
    },
    { name: "404", path: "/non-existent-page-test", expectedStatus: 404 },
  ];

  for (const route of routes) {
    console.log(`[QA] Navigating to Desktop: ${route.path}`);
    const res = await page.goto(`http://localhost:3000${route.path}`, {
      waitUntil: "networkidle",
    });

    const expectedStatus = route.expectedStatus || 200;
    if (res.status() !== expectedStatus) {
      errors.push(
        `Expected ${expectedStatus} status for ${route.path}, got ${res.status()}`,
      );
    }

    if (expectedStatus === 200) {
      // Check text for forbidden terms (no Muhammad / Fiaz identity)
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

  // 2. Test Language Switcher bidirectional flow
  console.log("[QA] Testing Language Switcher bidirectional flow...");
  await page.goto(
    "http://localhost:3000/blog/introduction-projets-voldigoade",
    { waitUntil: "networkidle" },
  );

  const enLink = page.locator(
    "nav[aria-label='Changer de langue'] a:has-text('EN')",
  );
  if (await enLink.isVisible()) {
    console.log("[QA] Clicking EN in switcher...");
    await enLink.click();
    await page.waitForURL("**/en/blog/introduction-to-voldigoade-projects");
    await page.waitForSelector("text=min read", { timeout: 5000 });
    const enText = (await page.innerText("body")).toLowerCase();
    if (!enText.includes("read")) {
      errors.push(
        "Expected English reading time ('min read') on /en/blog article",
      );
    }

    const frLink = page.locator(
      "nav[aria-label='Switch language'] a:has-text('FR')",
    );
    if (await frLink.isVisible()) {
      console.log("[QA] Clicking FR in switcher...");
      await frLink.click();
      await page.waitForURL("**/blog/introduction-projets-voldigoade");
      await page.waitForSelector("text=min de lecture", { timeout: 5000 });
      console.log(
        "[QA] Successfully navigated back to French article:",
        page.url(),
      );
    } else {
      errors.push("Could not find FR link on English article page");
    }
  } else {
    errors.push("Could not find EN link on French article page");
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
  console.log(`[QA] Cookie notice count: ${cookieNoticeCount}`);
  if (cookieNoticeCount > 0) {
    errors.push("Cookie notice should NOT be rendered anymore");
  }

  const manageCookiesCount = await page
    .locator("button:has-text('Gérer les préférences')")
    .count();
  console.log(
    `[QA] 'Gérer les préférences' button count: ${manageCookiesCount}`,
  );
  if (manageCookiesCount > 0) {
    errors.push(
      "Footer button 'Gérer les préférences' should NOT exist anymore",
    );
  }

  const cookiesPolicyLinkCount = await page
    .locator("a[href*='cookies-policy'], a:has-text('Cookies')")
    .count();
  console.log(`[QA] Cookies Policy link count: ${cookiesPolicyLinkCount}`);
  if (cookiesPolicyLinkCount > 0) {
    errors.push("Footer link to Cookies Policy should NOT exist anymore");
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
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
    { name: "project", path: "/project" },
    { name: "blog", path: "/blog" },
    { name: "article", path: "/blog/introduction-projets-voldigoade" },
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
      "ALL QA CHECKS PASSED PERFECTLY! ZERO GA REQUESTS, NO COOKIE BANNER, CLOUDFLARE ONLY.",
    );
  }
}

runQA().catch((err) => {
  console.error("QA script exception:", err);
  process.exit(1);
});
