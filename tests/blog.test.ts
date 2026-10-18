import { describe, expect, it } from "bun:test";
import * as blog from "../src/lib/blog";

const { parseArticleSources } = blog;

import {
  calculateReadingTime,
  getAllArticles,
  getArticleBySlug,
  getBlogPostsForListing,
  getPublishedArticles,
  renderMarkdownToHtml,
  validateFrontmatter,
} from "../src/lib/blog";

const valid = {
  title: "Parser fixture",
  slug: "parser-fixture",
  summary: "Internal deterministic fixture",
  type: "Note",
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
      ...valid,
      id: "parser-fixture",
      url: "/blog/parser-fixture",
      readingMinutes: 1,
    });
    expect(articles[0]?.body).toContain("Fixture **body**.");
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
    ["slug", "../traversal"],
    ["type", "Unknown"],
    ["tags", [123]],
    ["tags", []],
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

  it("rejects filename/slug mismatches", () => {
    expect(() => validateFrontmatter(valid, "other.md")).toThrow(
      /Filename \/ slug mismatch/,
    );
  });

  it("keeps synthetic slugs and every draft out of real public content", async () => {
    const published = await getPublishedArticles();
    const listings = await getBlogPostsForListing();
    const all = await getAllArticles({ includeDrafts: true });
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
      expect(await getArticleBySlug(slug)).toBeNull();
    }
    for (const draft of all.filter((article) => article.draft)) {
      expect(published.some((article) => article.slug === draft.slug)).toBe(
        false,
      );
      expect(listings.some((article) => article.slug === draft.slug)).toBe(
        false,
      );
      expect(await getArticleBySlug(draft.slug)).toBeNull();
    }
    for (const slug of ["../draft-example-post", "INVALID_UPPERCASE"]) {
      expect(await getArticleBySlug(slug)).toBeNull();
    }
  });

  it("calculates reading time", () => {
    expect(calculateReadingTime("Word ".repeat(50))).toBe(1);
    expect(calculateReadingTime("Word ".repeat(650))).toBe(4);
  });
});

describe("safe Markdown rendering", () => {
  it.each([
    "[click](javascript:alert%281%29)",
    "[click](jav&#x61;script:alert%281%29)",
    "[click](data:text/html;base64,PHNjcmlwdD4=)",
    "[click](vbscript:msgbox%281%29)",
    "[click](//evil.example/path)",
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
      "**bold** [site](https://example.com/?a=1&b=2) [local](/blog) [email](mailto:hello@example.com) ![alt](/images/writing/test.webp)",
    );
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('href="https://example.com/?a=1&amp;b=2"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain('href="mailto:hello@example.com"');
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
