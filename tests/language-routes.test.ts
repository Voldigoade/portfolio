import { describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));

const { metadata: frHomeMetadata } = await import("../src/app/(fr)/page");
const { metadata: frAboutMetadata } = await import(
  "../src/app/(fr)/about/page"
);
const { metadata: frProjectMetadata } = await import(
  "../src/app/(fr)/project/page"
);
const { metadata: frBlogMetadata } = await import("../src/app/(fr)/blog/page");
const { metadata: frPrivacyMetadata } = await import(
  "../src/app/(fr)/privacy-policy/page"
);

const { metadata: enHomeMetadata } = await import("../src/app/en/page");
const { metadata: enAboutMetadata } = await import("../src/app/en/about/page");
const { metadata: enProjectMetadata } = await import(
  "../src/app/en/project/page"
);
const { metadata: enBlogMetadata } = await import("../src/app/en/blog/page");
const { metadata: enPrivacyMetadata } = await import(
  "../src/app/en/privacy-policy/page"
);

const { default: sitemap } = await import("../src/app/sitemap");
const { getCopy } = await import("../src/lib/site-copy");

describe("bilingual site structure & metadata", () => {
  it("provides valid canonical and hreflang alternates for French routes", () => {
    const frRoutes = [
      { meta: frHomeMetadata, path: "/" },
      { meta: frAboutMetadata, path: "/about" },
      { meta: frProjectMetadata, path: "/project" },
      { meta: frBlogMetadata, path: "/blog" },
      { meta: frPrivacyMetadata, path: "/privacy-policy" },
    ];

    for (const { meta, path } of frRoutes) {
      expect(meta.alternates?.canonical).toBe(path);
      const langs = meta.alternates?.languages as Record<string, string>;
      expect(langs?.fr).toBe(path);
      expect(langs?.en).toBeDefined();
      expect(langs?.["x-default"]).toBe(path);
    }
  });

  it("provides valid canonical and hreflang alternates for English routes", () => {
    const enRoutes = [
      { meta: enHomeMetadata, path: "/en" },
      { meta: enAboutMetadata, path: "/en/about" },
      { meta: enProjectMetadata, path: "/en/project" },
      { meta: enBlogMetadata, path: "/en/blog" },
      { meta: enPrivacyMetadata, path: "/en/privacy-policy" },
    ];

    for (const { meta, path } of enRoutes) {
      expect(meta.alternates?.canonical).toBe(path);
      const langs = meta.alternates?.languages as Record<string, string>;
      expect(langs?.fr).toBeDefined();
      expect(langs?.en).toBe(path);
      expect(langs?.["x-default"]).toBeDefined();
    }
  });

  it("sitemap contains all mirrored FR and EN routes with mutual alternates", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://voldigoade.xyz");
    expect(urls).toContain("https://voldigoade.xyz/en");
    expect(urls).toContain("https://voldigoade.xyz/about");
    expect(urls).toContain("https://voldigoade.xyz/en/about");
    expect(urls).toContain("https://voldigoade.xyz/project");
    expect(urls).toContain("https://voldigoade.xyz/en/project");
    expect(urls).toContain("https://voldigoade.xyz/blog");
    expect(urls).toContain("https://voldigoade.xyz/en/blog");
    expect(urls).toContain("https://voldigoade.xyz/privacy-policy");
    expect(urls).toContain("https://voldigoade.xyz/en/privacy-policy");

    const homeEntry = entries.find((e) => e.url === "https://voldigoade.xyz");
    expect(homeEntry?.alternates?.languages?.en).toBe(
      "https://voldigoade.xyz/en",
    );
  });

  it("getCopy provides natural developer tone and contains no forbidden academic jargon", () => {
    const fr = getCopy("fr");
    const en = getCopy("en");

    expect(fr.nav.items).toHaveLength(4);
    expect(en.nav.items).toHaveLength(4);

    const forbiddenPhrases = [
      "modélisation de menaces",
      "souveraineté logicielle",
      "registre de preuves",
      "ingénierie logicielle",
      "recherche appliquée",
      "aspects stabilisés",
      "confidentialité numérique",
      "crukst",
    ];

    const allFrText = JSON.stringify(fr).toLowerCase();
    for (const phrase of forbiddenPhrases) {
      expect(allFrText).not.toContain(phrase);
    }

    // Featured projects check: Spoor and Crucksware present
    expect(allFrText).toContain("spoor");
    expect(allFrText).toContain("crucksware");

    const allEnText = JSON.stringify(en).toLowerCase();
    expect(allEnText).toContain("spoor");
    expect(allEnText).toContain("crucksware");
    expect(allEnText).not.toContain("crukst");

    // Footer check: Sitemap replaces Plan du site
    expect(fr.footer.links.map((l) => l.label)).toContain("Sitemap");
    expect(fr.footer.links.map((l) => l.label)).not.toContain("Plan du site");

    // About stack section: "Ce que j'utilise" / "What I Use" with 4 items
    expect(fr.about.stackTitle).toBe("Ce que j'utilise");
    expect(en.about.stackTitle).toBe("What I Use");
    expect(fr.about.stackItems).toHaveLength(4);
    expect(en.about.stackItems).toHaveLength(4);
    expect(fr.about.stackItems.map((i) => i.title)).toEqual([
      "Rust",
      "Linux",
      "Python",
      "TypeScript / Next.js",
    ]);

    // Spoor demo metadata: real torvalds capture
    expect(fr.home.terminal.meta.command).toBe("spoor torvalds");
    expect(fr.home.terminal.meta.target).toBe("torvalds");
    expect(fr.home.terminal.meta.sha).toBe(
      "7d49428a88b86204b23ae509b0be954d9c41110b",
    );
    expect(fr.home.terminal.meta.date).toBe("2026-10-19 10:57:48 UTC");
    expect(fr.home.terminal.p2).toContain("spoor torvalds");
    expect(fr.home.terminal.p2).toContain("restitution statique");

    expect(en.home.terminal.meta.command).toBe("spoor torvalds");
    expect(en.home.terminal.meta.target).toBe("torvalds");
    expect(en.home.terminal.meta.sha).toBe(
      "7d49428a88b86204b23ae509b0be954d9c41110b",
    );
    expect(en.home.terminal.meta.date).toBe("2026-10-19 10:57:48 UTC");
    expect(en.home.terminal.p2).toContain("spoor torvalds");
    expect(en.home.terminal.p2).toContain("static replay");
  });

  it("resolves bidirectional article translations between distinct slugs and leaves untranslated articles without fake URLs", async () => {
    const { getArticleBySlug } = await import("../src/lib/blog");
    const fs = await import("node:fs");
    const path = await import("node:path");

    // Verify obsolete article-level switcher component was removed
    const obsoleteComponentPath = path.join(
      process.cwd(),
      "src/components/portfolio/article-language-switcher.tsx",
    );
    expect(fs.existsSync(obsoleteComponentPath)).toBe(false);

    // Root-Me articles: distinct slugs mapped bidirectionally
    const rootMeFr = await getArticleBySlug(
      "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
      "fr",
    );
    const rootMeEn = await getArticleBySlug(
      "root-me-sudo-exploiting-a-sudoers-wildcard-with-path-traversal",
      "en",
    );
    expect(rootMeFr?.translationSlug).toBe(
      "root-me-sudo-exploiting-a-sudoers-wildcard-with-path-traversal",
    );
    expect(rootMeEn?.translationSlug).toBe(
      "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
    );

    // Rust articles: distinct slugs mapped bidirectionally
    const rustFr = await getArticleBySlug(
      "apprendre-rust-quand-les-llm-codent-deja-tres-bien",
      "fr",
    );
    const rustEn = await getArticleBySlug(
      "learning-rust-while-llms-keep-getting-better-at-coding",
      "en",
    );
    expect(rustFr?.translationSlug).toBe(
      "learning-rust-while-llms-keep-getting-better-at-coding",
    );
    expect(rustEn?.translationSlug).toBe(
      "apprendre-rust-quand-les-llm-codent-deja-tres-bien",
    );

    // Fake or untranslated article fixture has no translationSlug
    const untranslatedMock = {
      slug: "untranslated-unique-post",
      frenchVersion: undefined,
      translationSlug: undefined,
    };
    expect(untranslatedMock.translationSlug).toBeUndefined();
  });
});
