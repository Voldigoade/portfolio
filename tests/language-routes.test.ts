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
  });
});
