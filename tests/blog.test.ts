import { describe, expect, it } from "bun:test";
import * as blog from "../src/lib/blog";

const { parseArticleSources } = blog;

import {
  calculateReadingMinutes,
  calculateReadingTime,
  calculateReadingTimeText,
  formatArticleDate,
  getAllArticles,
  getArticleBySlug,
  getBlogPostsForListing,
  getPublishedArticles,
  getSeriesNavigation,
  normalizeTranslationRef,
  parseCodeFence,
  renderMarkdown,
  renderMarkdownToHtml,
  slugifyHeading,
  validateFrontmatter,
} from "../src/lib/blog";
import { withWritingFiles } from "./helpers/writing";

const valid = {
  title: "Parser fixture",
  slug: "parser-fixture",
  summary: "Internal deterministic fixture",
  category: "Systèmes",
  tags: ["testing"],
  publishedAt: "2026-10-18",
  draft: false,
};

function articleSource(overrides: Record<string, unknown> = {}) {
  const data = { ...valid, ...overrides };
  return {
    filename: `${String(data.slug)}.md`,
    content: `---\n${Object.entries(data)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join("\n")}\n---\n\nFixture **body**.`,
  };
}

describe("article parsing and publication boundary", () => {
  it("parses valid frontmatter and body with stable public URLs", () => {
    const articles = parseArticleSources([articleSource()]);
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      title: "Parser fixture",
      slug: "parser-fixture",
      summary: "Internal deterministic fixture",
      category: "Systèmes",
      tags: ["testing"],
      id: "parser-fixture",
      url: "/blog/parser-fixture",
      readingMinutes: 1,
      readingTimeText: "1 min de lecture",
    });
    expect(articles[0]?.body).toContain("Fixture **body**.");
  });

  it("derives slug from filename when slug is omitted from frontmatter", () => {
    const withoutSlug = {
      title: "Parser fixture",
      summary: "Internal deterministic fixture",
      publishedAt: "2026-10-18",
      draft: false,
    };
    const articles = parseArticleSources([
      {
        filename: "auto-derived-slug.md",
        content: `---\n${Object.entries(withoutSlug)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join("\n")}\n---\nBody`,
      },
    ]);
    expect(articles[0]?.slug).toBe("auto-derived-slug");
    expect(articles[0]?.url).toBe("/blog/auto-derived-slug");
  });

  it("supports English locale with /en/blog URL and 'X min read'", () => {
    const articles = parseArticleSources(
      [
        {
          filename: "english-post.md",
          locale: "en",
          content: `---\ntitle: "English Post"\nsummary: "English summary"\npublishedAt: "2026-10-18"\ndraft: false\n---\nBody content`,
        },
      ],
      { locale: "en" },
    );
    expect(articles[0]?.locale).toBe("en");
    expect(articles[0]?.url).toBe("/en/blog/english-post");
    expect(articles[0]?.readingTimeText).toBe("1 min read");
    expect(articles[0]?.category).toBe("Systems");
  });

  it("excludes drafts, including from an otherwise empty collection", () => {
    const draft = articleSource({ draft: true });
    expect(parseArticleSources([draft])).toEqual([]);
    expect(parseArticleSources([])).toEqual([]);
    expect(parseArticleSources([draft], { includeDrafts: true })).toHaveLength(
      1,
    );
  });

  it("rejects executable frontmatter engines before evaluating them", () => {
    expect(() =>
      parseArticleSources([
        {
          filename: "parser-fixture.md",
          content:
            '---javascript\n(() => { throw new Error("executed frontmatter") })()\n---\nBody',
        },
      ]),
    ).toThrow(/YAML/);
  });

  it("rejects missing frontmatter closing delimiters", () => {
    const source = articleSource();
    source.content = source.content.replace("\n---\n\nFixture **body**.", "");
    expect(() => parseArticleSources([source])).toThrow(/YAML/);
  });

  it.each(["null", "scalar", "- list-item", "2026-10-18", "!!binary aGVsbG8="])(
    "requires mapping frontmatter for %s",
    (yaml) => {
      expect(() =>
        parseArticleSources([
          { filename: "parser-fixture.md", content: `---\n${yaml}\n---\nBody` },
        ]),
      ).toThrow(/mapping/);
    },
  );

  it("preserves CRLF Markdown after the first complete closing delimiter", () => {
    const source = articleSource();
    source.content =
      source.content.replaceAll("\n", "\r\n") +
      "\r\n---\r\nMarkdown after a horizontal rule.\r\n";
    expect(parseArticleSources([source])[0]?.body).toBe(
      "\r\nFixture **body**.\r\n---\r\nMarkdown after a horizontal rule.\r\n",
    );
  });

  it("does not accept a closing delimiter with a suffix", () => {
    const source = articleSource();
    source.content = source.content.replace("\n---\n", "\n---suffix\n");
    expect(() => parseArticleSources([source])).toThrow(/YAML/);
  });

  it("rejects duplicate slugs instead of overwriting content", () => {
    expect(() =>
      parseArticleSources([articleSource(), articleSource()]),
    ).toThrow(/Duplicate slug/);
  });

  it("accepts date values emitted by YAML frontmatter", () => {
    const source = articleSource();
    source.content = source.content.replace(
      'publishedAt: "2026-10-18"',
      "publishedAt: 2026-10-18",
    );
    expect(parseArticleSources([source])[0]?.publishedAt).toBe(
      "2026-10-18T00:00:00.000Z",
    );
  });

  it.each([
    ["title", ""],
    ["summary", ""],
    ["category", ""],
    ["tags", [123]],
    ["tags", ["   "]],
    ["publishedAt", "2026-02-31"],
    ["publishedAt", "October 18, 2026"],
    ["updatedAt", "yesterday"],
    ["draft", "false"],
    ["canonical", "javascript:alert(1)"],
    ["cover", "//evil.example/x.svg"],
  ])("rejects invalid %s: %j", (key, value) => {
    expect(() =>
      validateFrontmatter({ ...valid, [key]: value }, "parser-fixture.md"),
    ).toThrow();
  });

  it("rejects filename/slug mismatches when slug is explicitly provided", () => {
    expect(() => validateFrontmatter(valid, "other.md")).toThrow(
      /Filename \/ slug mismatch/,
    );
  });

  it("rejects filenames that produce invalid slugs", () => {
    expect(() =>
      validateFrontmatter(
        {
          title: "Test",
          summary: "Summary",
          publishedAt: "2026-10-18",
          draft: false,
        },
        "../traversal.md",
      ),
    ).toThrow(/invalid slug/);
  });

  it("keeps synthetic slugs and every draft out of real public content", async () => {
    const published = await getPublishedArticles("fr");
    const listings = await getBlogPostsForListing("fr");
    const all = await getAllArticles({ locale: "fr", includeDrafts: true });
    const syntheticSlugs = [
      "spoor-github-footprint-inspection",
      "threat-modeling-secure-messengers",
      "ide-architectures-and-remote-workflows",
    ];
    expect(published.every((article) => article.draft === false)).toBe(true);
    expect(listings.every((article) => article.draft === false)).toBe(true);
    expect(listings.map((article) => article.slug)).toEqual(
      published.map((article) => article.slug),
    );
    for (const slug of syntheticSlugs) {
      expect(all.some((article) => article.slug === slug)).toBe(false);
      expect(await getArticleBySlug(slug, "fr")).toBeNull();
    }
    for (const draft of all.filter((article) => article.draft)) {
      expect(published.some((article) => article.slug === draft.slug)).toBe(
        false,
      );
      expect(listings.some((article) => article.slug === draft.slug)).toBe(
        false,
      );
      expect(await getArticleBySlug(draft.slug, "fr")).toBeNull();
    }
    for (const slug of ["../draft-example-post", "INVALID_UPPERCASE"]) {
      expect(await getArticleBySlug(slug, "fr")).toBeNull();
    }
  });

  it("calculates reading time and text per locale", () => {
    expect(calculateReadingMinutes("Word ".repeat(50))).toBe(1);
    expect(calculateReadingMinutes("Word ".repeat(650))).toBe(4);
    expect(calculateReadingTime("Word ".repeat(50))).toBe(1);
    expect(calculateReadingTimeText("Word ".repeat(50), "fr")).toBe(
      "1 min de lecture",
    );
    expect(calculateReadingTimeText("Word ".repeat(50), "en")).toBe(
      "1 min read",
    );
  });

  it("normalizes Pages CMS reference values to clean slugs", () => {
    expect(
      normalizeTranslationRef(
        "content/writing/fr/root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal.md",
      ),
    ).toBe("root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal");
    expect(
      normalizeTranslationRef(
        "content\\writing\\fr\\root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal.md",
      ),
    ).toBe("root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal");
    expect(
      normalizeTranslationRef(
        "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal.md",
      ),
    ).toBe("root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal");
    expect(
      normalizeTranslationRef(
        "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
      ),
    ).toBe("root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal");
    expect(normalizeTranslationRef("")).toBeUndefined();
    expect(normalizeTranslationRef(undefined)).toBeUndefined();
    expect(normalizeTranslationRef("   ")).toBeUndefined();
    expect(
      normalizeTranslationRef("invalid/slug with spaces.md"),
    ).toBeUndefined();
  });

  it("resolves bidirectional translations using Pages CMS reference path values and distinct slugs", async () => {
    await withWritingFiles(
      {
        "fr/root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal.md": `---
title: "Root-Me : exploiter une wildcard sudoers avec un path traversal"
summary: "Write-up du challenge"
category: "CTF"
tags: ["root-me"]
publishedAt: "2025-12-22"
draft: false
---
Contenu FR`,
        "en/root-me-exploiting-a-sudoers-wildcard-with-path-traversal.md": `---
title: "Root-Me: Exploiting a sudoers wildcard with path traversal"
summary: "Challenge write-up"
category: "CTF"
tags: ["root-me"]
publishedAt: "2025-12-22"
draft: false
frenchVersion: "content/writing/fr/root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal.md"
---
Content EN`,
      },
      async () => {
        const frArticles = await getAllArticles({ locale: "fr" });
        const enArticles = await getAllArticles({ locale: "en" });

        expect(frArticles).toHaveLength(1);
        expect(enArticles).toHaveLength(1);

        const fr = frArticles[0];
        const en = enArticles[0];

        expect(en?.frenchVersion).toBe(
          "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
        );
        expect(en?.translationSlug).toBe(
          "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
        );
        expect(fr?.translationSlug).toBe(
          "root-me-exploiting-a-sudoers-wildcard-with-path-traversal",
        );

        const fetchedFr = await getArticleBySlug(
          "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
          "fr",
        );
        expect(fetchedFr?.translationSlug).toBe(
          "root-me-exploiting-a-sudoers-wildcard-with-path-traversal",
        );

        const fetchedEn = await getArticleBySlug(
          "root-me-exploiting-a-sudoers-wildcard-with-path-traversal",
          "en",
        );
        expect(fetchedEn?.translationSlug).toBe(
          "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
        );
      },
    );
  });

  it("formats dates in a clean locale-aware style and avoids timezone shifts", () => {
    // Exact format required: "12 déc. 2025" for FR and "Dec 12, 2025" for EN
    expect(formatArticleDate("2025-12-12", "fr")).toBe("12 déc. 2025");
    expect(formatArticleDate("2025-12-12", "en")).toBe("Dec 12, 2025");

    // Must handle full ISO strings with T00:00:00.000Z identically without date shifts
    expect(formatArticleDate("2025-12-12T00:00:00.000Z", "fr")).toBe(
      "12 déc. 2025",
    );
    expect(formatArticleDate("2025-12-12T00:00:00.000Z", "en")).toBe(
      "Dec 12, 2025",
    );

    // Human-visible output never contains raw ISO strings or timestamps
    const formattedFr = formatArticleDate("2025-12-12T00:00:00.000Z", "fr");
    const formattedEn = formatArticleDate("2025-12-12T00:00:00.000Z", "en");
    expect(formattedFr).not.toContain("T00:00:00");
    expect(formattedFr).not.toContain(".000Z");
    expect(formattedEn).not.toContain("T00:00:00");
    expect(formattedEn).not.toContain(".000Z");

    // Gracefully returns original value if unparseable
    expect(formatArticleDate("not-a-date", "fr")).toBe("not-a-date");
  });
});

describe("safe Markdown rendering", () => {
  it.each([
    "[click](javascript:alert%281%29)",
    "[click](jav&#x61;script:alert%281%29)",
    "[click](data:text/html;base64,PHNjcmlwdD4=)",
    "[click](vbscript:msgbox%281%29)",
    "[click](//evil.example/path)",
    "[click](mailto:test@example.com)",
    "![image](javascript:alert%281%29)",
    "![image](data:image/svg+xml;base64,PHN2Zz4=)",
    "![image](/images/writing/unsafe.svg)",
  ])("does not emit dangerous URLs for %s", async (markdown) => {
    const html = await renderMarkdownToHtml(markdown);
    expect(html).not.toMatch(/\b(?:href|src)=/);
  });

  it("escapes raw HTML and quoted image attributes", async () => {
    const html = await renderMarkdownToHtml(
      '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n![a" onerror="alert(1)](/images/writing/test.png "quote\\" onload=alert(1)")',
    );
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toMatch(/<img[^>]+\son(?:error|load)="/);
    expect(html).toContain("&lt;script&gt;");
  });

  it("preserves safe links, formatting and raster images", async () => {
    const html = await renderMarkdownToHtml(
      "**bold** [site](https://example.com/?a=1&b=2) [local](/blog) ![alt](/images/writing/test.webp)",
    );
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('href="https://example.com/?a=1&amp;b=2"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain('src="/images/writing/test.webp"');
  });

  it("renders fenced, tilde, indented and nested code in order without placeholder collisions", async () => {
    const html = await renderMarkdownToHtml(
      "__SHIKI_CODE_BLOCK_0__\n\n~~~unknown-language\n<first>\n~~~\n\n    <second>\n\n> ```text\n> <third>\n> ```\n\n```ts title=sample\nconst fourth = '<script>';\n```",
    );
    expect(html.match(/<pre\b/g)).toHaveLength(4);
    expect(html).toContain("&lt;first&gt;");
    expect(html).toMatch(/(?:&lt;|&#x3C;)second(?:&gt;|>)/);
    expect(html).toMatch(/(?:&lt;|&#x3C;)third(?:&gt;|>)/);
    expect(html).not.toContain("<script>");
    expect(html).toContain("SHIKI_CODE_BLOCK_0");
    expect(html.indexOf("first")).toBeLessThan(html.indexOf("second"));
    expect(html.indexOf("second")).toBeLessThan(html.indexOf("third"));
  });
});

describe("advanced markdown code blocks and developer UX", () => {
  it("normalizes common language aliases and parses optional titles", () => {
    expect(parseCodeFence("rs")).toEqual({
      lang: "rs",
      normalizedLang: "rust",
      label: "Rust",
      title: undefined,
    });
    expect(parseCodeFence("py")).toEqual({
      lang: "py",
      normalizedLang: "python",
      label: "Python",
      title: undefined,
    });
    expect(parseCodeFence("ts")).toEqual({
      lang: "ts",
      normalizedLang: "typescript",
      label: "TypeScript",
      title: undefined,
    });
    expect(parseCodeFence("sh")).toEqual({
      lang: "sh",
      normalizedLang: "bash",
      label: "Shell",
      title: undefined,
    });
    expect(parseCodeFence("bash")).toEqual({
      lang: "bash",
      normalizedLang: "bash",
      label: "Bash",
      title: undefined,
    });
    expect(parseCodeFence('rust title="src/main.rs"')).toEqual({
      lang: "rust",
      normalizedLang: "rust",
      label: "Rust",
      title: "src/main.rs",
    });
    expect(parseCodeFence("python title='scripts/test.py'")).toEqual({
      lang: "python",
      normalizedLang: "python",
      label: "Python",
      title: "scripts/test.py",
    });
    expect(parseCodeFence("")).toEqual({
      lang: "text",
      normalizedLang: "text",
      label: "Text",
      title: undefined,
    });
  });

  it("renders code panels with copy button, data-code, and safe title escaping", async () => {
    const markdown =
      '```rust title="<unsafe>.rs"\nfn main() {\n    let x = 42;\n    let y = 100;\n}\n```';
    const html = await renderMarkdownToHtml(markdown, "fr");

    expect(html).toContain('class="not-prose code-panel');
    expect(html).toContain('class="copy-code-button');
    expect(html).toContain("Copier");
    expect(html).toContain("&lt;unsafe&gt;.rs");
    expect(html).not.toContain("<unsafe>.rs");

    // data-code must contain the exact raw code encoded
    const encoded = encodeURIComponent(
      "fn main() {\n    let x = 42;\n    let y = 100;\n}",
    );
    expect(html).toContain(`data-code="${encoded}"`);

    // Multiline rust code gets line numbers
    expect(html).toContain("code-with-lines");
  });

  it("omits line numbers for one-line commands and shell snippets", async () => {
    const singleLine = "```bash\nsudo -l\n```";
    const htmlSingle = await renderMarkdownToHtml(singleLine);
    expect(htmlSingle).not.toContain("code-with-lines");

    const multiLineBash = "```bash\ncd /tmp\nls -la\nwhoami\n```";
    const htmlBash = await renderMarkdownToHtml(multiLineBash);
    expect(htmlBash).not.toContain("code-with-lines");
  });

  it("preserves technical text verbatim without transforming into links or entities inside code", async () => {
    const technicalSnippet =
      "```text\nssh user@example.org\nreadme.md\nCargo.toml\nsrc/main.rs\n../\n*\n@\n~\n=\n```";
    const html = await renderMarkdownToHtml(technicalSnippet);

    expect(html).not.toContain("mailto:user@example.org");
    expect(html).not.toContain('href="http://readme.md"');
    expect(html).toContain("ssh user@example.org");
    expect(html).toContain("Cargo.toml");
    expect(html).toContain("../");
  });
});

describe("heading anchors and table of contents", () => {
  it("generates deterministic kebab-case heading IDs and handles accents and duplicates", () => {
    expect(slugifyHeading("Vérifier les droits sudo")).toBe(
      "verifier-les-droits-sudo",
    );
    expect(slugifyHeading("Root-Me : exploiter une wildcard sudoers")).toBe(
      "root-me-exploiter-une-wildcard-sudoers",
    );
    expect(slugifyHeading("Why sudoers is vulnerable")).toBe(
      "why-sudoers-is-vulnerable",
    );
  });

  it("injects heading anchors and extracts TOC items", async () => {
    const md =
      "## Section Première\nContent 1\n\n## Section Deuxième\nContent 2\n\n## Section Troisième\nContent 3\n\n### Sous-section\nSubcontent";
    const { html, toc } = await renderMarkdown(md, "fr");

    expect(html).toContain('id="section-premiere"');
    expect(html).toContain('id="section-deuxieme"');
    expect(html).toContain('id="section-troisieme"');
    expect(html).toContain('id="sous-section"');
    expect(html).toContain('class="anchor-link');

    expect(toc).toHaveLength(4);
    expect(toc[0]).toEqual({
      id: "section-premiere",
      text: "Section Première",
      depth: 2,
    });
    expect(toc[1]).toEqual({
      id: "section-deuxieme",
      text: "Section Deuxième",
      depth: 2,
    });
    expect(toc[2]).toEqual({
      id: "section-troisieme",
      text: "Section Troisième",
      depth: 2,
    });
    expect(toc[3]).toEqual({
      id: "sous-section",
      text: "Sous-section",
      depth: 3,
    });
  });

  it("handles duplicate headings cleanly with suffix counters", async () => {
    const md = "## Example\nFirst\n\n## Example\nSecond\n\n## Example\nThird";
    const { html, toc } = await renderMarkdown(md);

    expect(html).toContain('id="example"');
    expect(html).toContain('id="example-2"');
    expect(html).toContain('id="example-3"');
    expect(toc.map((t) => t.id)).toEqual(["example", "example-2", "example-3"]);
  });
});

describe("series navigation", () => {
  it("returns null when article has no series or is the only article in the series", async () => {
    const singleArticle = {
      title: "Solo",
      slug: "solo",
      summary: "Solo article",
      category: "Test",
      tags: [],
      publishedAt: "2026-01-01",
      draft: false,
      locale: "fr" as const,
    };
    const nav = await getSeriesNavigation(singleArticle);
    expect(nav).toBeNull();
  });
});

describe("real published articles validation", () => {
  it("renders the Root-Me article with bash blocks, H2 anchors, and TOC", async () => {
    const article = await getArticleBySlug(
      "root-me-exploiter-une-wildcard-sudoers-avec-un-path-traversal",
      "fr",
    );
    expect(article).not.toBeNull();
    if (!article) throw new Error("Article not found");

    expect(article.title).toContain("Root-Me");
    expect(article.category).toBe("CTF");
    expect(article.html).toContain("code-panel");
    expect(decodeURIComponent(article.html || "")).toContain("sudo -l");
    expect(article.toc?.length).toBeGreaterThanOrEqual(3);
    expect(article.toc?.some((t) => t.id.includes("verifier"))).toBe(true);
  });

  it("renders the Rust/LLM article with rust code blocks, comparison, and TOC", async () => {
    const article = await getArticleBySlug(
      "apprendre-rust-quand-les-llm-codent-deja-tres-bien",
      "fr",
    );
    expect(article).not.toBeNull();
    if (!article) throw new Error("Article not found");

    expect(article.title).toContain("Apprendre Rust");
    expect(article.html).toContain("code-panel");

    // Extract raw code from data-code attribute
    const dataCodeMatches = Array.from(
      (article.html || "").matchAll(/data-code="([^"]+)"/g),
    );
    const decodedSnippets = dataCodeMatches.map((m) =>
      decodeURIComponent(m[1]),
    );
    expect(
      decodedSnippets.some((snippet) => snippet.includes('path == "."')),
    ).toBe(true);

    expect(article.toc?.length).toBeGreaterThanOrEqual(3);
  });
});
