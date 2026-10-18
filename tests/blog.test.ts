import { describe, expect, it } from "bun:test";
import {
  calculateReadingTime,
  getAllArticles,
  getArticleBySlug,
  getBlogPostsForListing,
  getPublishedArticles,
  VALID_WRITING_TYPES,
  validateFrontmatter,
} from "../src/lib/blog";
import type { WritingType } from "../src/lib/portfolio-types";

describe("First-Party Blog & Markdown Engine", () => {
  it("retrieves published writing posts and strictly excludes drafts", async () => {
    const published = await getPublishedArticles();
    expect(published.length).toBeGreaterThanOrEqual(3);

    for (const article of published) {
      expect(article.draft).toBe(false);
      expect(article.title).toBeTruthy();
      expect(article.slug).toBeTruthy();
      expect(article.summary).toBeTruthy();
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.tags.length).toBeGreaterThan(0);
      expect(VALID_WRITING_TYPES).toContain(article.type);
      expect(article.readingMinutes).toBeGreaterThan(0);
      expect(article.url).toBe(`/blog/${article.slug}`);
    }

    // Verify draft post is excluded
    const draftFound = published.find((p) => p.slug === "draft-example-post");
    expect(draftFound).toBeUndefined();

    // Verify including drafts returns the draft
    const all = await getAllArticles({ includeDrafts: true });
    const draftInAll = all.find((p) => p.slug === "draft-example-post");
    expect(draftInAll).toBeDefined();
    expect(draftInAll?.draft).toBe(true);
  });

  it("retrieves a published article by slug with rendered HTML", async () => {
    const article = await getArticleBySlug("spoor-github-footprint-inspection");
    expect(article).not.toBeNull();
    expect(article?.title).toContain("Spoor");
    expect(article?.html).toContain("<p>");
    expect(article?.draft).toBe(false);
    expect(article?.type).toBe("Project Log");
  });

  it("returns null for drafts when includeDrafts is false or omitted", async () => {
    const draft = await getArticleBySlug("draft-example-post");
    expect(draft).toBeNull();
  });

  it("returns null for non-existent slugs", async () => {
    const nonExistent = await getArticleBySlug("non-existent-article-slug-xyz");
    expect(nonExistent).toBeNull();
  });

  it("returns null for invalid slug formats and path traversal attempts", async () => {
    expect(await getArticleBySlug("../../../etc/passwd")).toBeNull();
    expect(await getArticleBySlug("..\\windows\\system32")).toBeNull();
    expect(await getArticleBySlug("sub/dir/post")).toBeNull();
    expect(await getArticleBySlug("INVALID_UPPERCASE")).toBeNull();
  });

  it("calculates reading time appropriately", () => {
    const shortText = "Word ".repeat(50);
    expect(calculateReadingTime(shortText)).toBe(1);

    const longText = "Word ".repeat(650);
    expect(calculateReadingTime(longText)).toBe(4);
  });

  it("validates frontmatter schemas and flags errors", () => {
    expect(() =>
      validateFrontmatter(
        {
          title: "Test",
          slug: "test-slug",
          summary: "Summary",
          type: "InvalidType" as unknown as WritingType,
          tags: ["test"],
          publishedAt: "2026-01-01",
          draft: false,
        },
        "test-slug.md",
      ),
    ).toThrow(/Invalid 'type'/);

    expect(() =>
      validateFrontmatter(
        {
          title: "Test",
          slug: "mismatched-slug",
          summary: "Summary",
          type: "Article",
          tags: ["test"],
          publishedAt: "2026-01-01",
          draft: false,
        },
        "test-slug.md",
      ),
    ).toThrow(/Filename \/ slug mismatch/);
  });

  it("formats blog posts for listing correctly", async () => {
    const list = await getBlogPostsForListing();
    expect(list.length).toBeGreaterThanOrEqual(3);
    for (const item of list) {
      expect(item.id).toBeTruthy();
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.excerpt).toBeTruthy();
      expect(item.draft).toBe(false);
    }
  });
});
