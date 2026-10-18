const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const SCREENSHOTS_DIR =
  "/home/cruck/.gemini/antigravity/brain/83f26293-bb20-4307-ac17-bd7f18f9ffa9/qa_screenshots";
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runQA() {
  console.log("=== STARTING BROWSER E2E QA ===");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/home/cruck/.local/bin/google-chrome",
  });

  const errors = [];

  // 1. Desktop Light & Dark Testing
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await desktopContext.newPage();

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
    { name: "404", path: "/non-existent-page-test" },
  ];

  for (const route of routes) {
    console.log(`[QA] Navigating to Desktop: ${route.path}`);
    const res = await page.goto(`http://localhost:3000${route.path}`, {
      waitUntil: "networkidle",
    });

    if (route.name === "404") {
      if (res.status() !== 404) {
        errors.push(
          `Expected 404 status for ${route.path}, got ${res.status()}`,
        );
      }
    } else if (res.status() !== 200) {
      errors.push(`Expected 200 status for ${route.path}, got ${res.status()}`);
    }

    // Check text for forbidden terms (except legal notice / license page if any)
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

  // 2. Test Language Switcher bidirectional flow
  console.log("[QA] Testing Language Switcher bidirectional flow...");
  await page.goto(
    "http://localhost:3000/blog/introduction-projets-voldigoade",
    { waitUntil: "networkidle" },
  );

  // Find EN button in switcher
  const enLink = page.locator(
    "nav[aria-label='Changer de langue'] a:has-text('EN')",
  );
  if (await enLink.isVisible()) {
    console.log("[QA] Clicking EN in switcher...");
    await enLink.click();
    await page.waitForURL("**/en/blog/introduction-to-voldigoade-projects");
    console.log("[QA] Successfully navigated to English article:", page.url());

    // Wait for client navigation to complete and English content to render
    await page.waitForSelector("text=min read", { timeout: 5000 });
    const enText = (await page.innerText("body")).toLowerCase();
    if (!enText.includes("read")) {
      errors.push(
        "Expected English reading time ('min read') on /en/blog article",
      );
    }

    // Click FR in switcher
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

  // 3. Test Cookie Notice & Preference reopen
  console.log("[QA] Testing Cookie Notice & Footer 'Gérer les préférences'...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const cookieNotice = page
    .locator(
      "aside[aria-label*='consentement'], div:has-text('MESURE D\\'AUDIENCE')",
    )
    .first();
  const isCookieVisible = await cookieNotice.isVisible();
  console.log(`[QA] Cookie notice initially visible: ${isCookieVisible}`);
  if (!isCookieVisible) {
    errors.push("Cookie notice was not visible on first visit");
  }

  // Click REFUSER
  const refuseBtn = page.locator("button:has-text('REFUSER')");
  if (await refuseBtn.isVisible()) {
    await refuseBtn.click();
    await page.waitForTimeout(400);
    const hiddenAfterRefuse = !(await cookieNotice.isVisible());
    console.log(
      `[QA] Cookie notice hidden after REFUSER: ${hiddenAfterRefuse}`,
    );
    if (!hiddenAfterRefuse) {
      errors.push("Cookie notice did not hide after clicking REFUSER");
    }
  }

  // Scroll to footer and click "Gérer les préférences"
  const manageCookiesBtn = page.locator(
    "button:has-text('Gérer les préférences')",
  );
  if (await manageCookiesBtn.isVisible()) {
    await manageCookiesBtn.click();
    await page.waitForTimeout(400);
    const visibleAfterManage = await page
      .locator("div:has-text('MESURE D\\'AUDIENCE')")
      .first()
      .isVisible();
    console.log(
      `[QA] Cookie notice visible after clicking 'Gérer les préférences': ${visibleAfterManage}`,
    );
    if (!visibleAfterManage) {
      errors.push(
        "Cookie notice did not reopen after clicking 'Gérer les préférences'",
      );
    }

    // Now click ACCEPTER
    const acceptBtn = page.locator("button:has-text('ACCEPTER')");
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(400);
      const hiddenAfterAccept = !(await page
        .locator("div:has-text('MESURE D\\'AUDIENCE')")
        .first()
        .isVisible());
      console.log(
        `[QA] Cookie notice hidden after ACCEPTER: ${hiddenAfterAccept}`,
      );
      if (!hiddenAfterAccept) {
        errors.push("Cookie notice did not hide after clicking ACCEPTER");
      }
    }
  } else {
    errors.push("Could not find footer button 'Gérer les préférences'");
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

  console.log("=== BROWSER QA FINISHED ===");
  if (errors.length > 0) {
    console.error("QA Errors encountered:", errors);
    process.exit(1);
  } else {
    console.log("ALL QA CHECKS PASSED PERFECTLY!");
  }
}

runQA().catch((err) => {
  console.error("QA script exception:", err);
  process.exit(1);
});
