import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { codeToHtml } from "shiki";
import type { BlogPost, WritingType } from "@/lib/portfolio-types";

export const VALID_WRITING_TYPES: WritingType[] = [
  "Article",
  "Write-up",
  "Research",
  "Note",
  "Project Log",
];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  summary: string;
  type: WritingType;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  draft: boolean;
  cover?: string;
  canonical?: string;
}

export interface Article extends ArticleFrontmatter {
  id: string;
  body: string;
  html?: string;
  readingMinutes: number;
  url: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "writing");

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}

export function validateFrontmatter(
  data: Record<string, unknown>,
  filename: string,
): ArticleFrontmatter {
  const errors: string[] = [];

  if (typeof data.title !== "string" || !data.title.trim()) {
    errors.push(`Missing or invalid 'title' in ${filename}`);
  }

  if (typeof data.slug !== "string" || !SLUG_REGEX.test(data.slug)) {
    errors.push(
      `Invalid 'slug' in ${filename}. Must be lowercase alphanumeric with hyphens (received: ${String(data.slug)})`,
    );
  }

  const expectedSlug = filename.replace(/\.md$/, "");
  if (data.slug !== expectedSlug) {
    errors.push(
      `Filename / slug mismatch in ${filename}: filename is '${expectedSlug}.md' but frontmatter slug is '${String(data.slug)}'`,
    );
  }

  if (typeof data.summary !== "string" || !data.summary.trim()) {
    errors.push(`Missing or invalid 'summary' in ${filename}`);
  }

  if (
    typeof data.type !== "string" ||
    !VALID_WRITING_TYPES.includes(data.type as WritingType)
  ) {
    errors.push(
      `Invalid 'type' in ${filename}: must be one of [${VALID_WRITING_TYPES.join(", ")}], got: '${String(data.type)}'`,
    );
  }

  if (!Array.isArray(data.tags)) {
    errors.push(`'tags' in ${filename} must be an array of strings`);
  }

  if (
    typeof data.publishedAt !== "string" ||
    Number.isNaN(Date.parse(data.publishedAt))
  ) {
    errors.push(
      `Invalid 'publishedAt' date in ${filename}: '${String(data.publishedAt)}'`,
    );
  }

  if (
    data.updatedAt !== undefined &&
    (typeof data.updatedAt !== "string" ||
      Number.isNaN(Date.parse(data.updatedAt)))
  ) {
    errors.push(
      `Invalid 'updatedAt' date in ${filename}: '${String(data.updatedAt)}'`,
    );
  }

  if (typeof data.draft !== "boolean") {
    errors.push(`'draft' in ${filename} must be a boolean (true or false)`);
  }

  if (data.cover !== undefined && typeof data.cover !== "string") {
    errors.push(`'cover' in ${filename} must be a string path or URL`);
  }

  if (data.canonical !== undefined && typeof data.canonical !== "string") {
    errors.push(`'canonical' in ${filename} must be a string URL`);
  }

  if (errors.length > 0) {
    throw new Error(`Frontmatter validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    title: (data.title as string).trim(),
    slug: (data.slug as string).trim(),
    summary: (data.summary as string).trim(),
    type: data.type as WritingType,
    tags: (data.tags as unknown[]).map((t) => String(t).trim()).filter(Boolean),
    publishedAt: (data.publishedAt as string).trim(),
    updatedAt: data.updatedAt ? String(data.updatedAt).trim() : undefined,
    draft: Boolean(data.draft),
    cover: data.cover ? String(data.cover).trim() : undefined,
    canonical: data.canonical ? String(data.canonical).trim() : undefined,
  };
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const marked = new Marked();

  let blockIndex = 0;

  marked.use({
    renderer: {
      code() {
        const placeholder = `__SHIKI_CODE_BLOCK_${blockIndex++}__`;
        return placeholder;
      },
    },
  });

  // Extract code blocks first to highlight with Shiki
  const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const blocks: Array<{ lang: string; code: string }> = [];
  let match: RegExpExecArray | null = fenceRegex.exec(markdown);

  while (match !== null) {
    blocks.push({
      lang: match[1]?.trim() || "text",
      code: match[2] ?? "",
    });
    match = fenceRegex.exec(markdown);
  }

  const highlightedBlocks = await Promise.all(
    blocks.map(async (block) => {
      try {
        return await codeToHtml(block.code, {
          lang: block.lang || "text",
          theme: "nord",
        });
      } catch {
        // Fallback for unsupported language
        return `<pre class="border-2 border-black bg-muted p-4 overflow-x-auto"><code>${block.code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`;
      }
    }),
  );

  let parsed = await marked.parse(markdown);

  // Replace placeholders with highlighted code
  highlightedBlocks.forEach((html, i) => {
    parsed = parsed.replace(`__SHIKI_CODE_BLOCK_${i}__`, html);
  });

  // Strip unsafe raw script/iframe tags
  parsed = parsed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  return parsed;
}

export async function getAllArticles(options?: {
  includeDrafts?: boolean;
}): Promise<Article[]> {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    const mdFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name);

    const articles: Article[] = [];
    const seenSlugs = new Set<string>();

    for (const filename of mdFiles) {
      const fullPath = path.join(CONTENT_DIR, filename);
      const rawContent = await fs.readFile(fullPath, "utf-8");
      const { data, content } = matter(rawContent);

      const frontmatter = validateFrontmatter(data, filename);

      if (seenSlugs.has(frontmatter.slug)) {
        throw new Error(
          `Duplicate slug '${frontmatter.slug}' found in ${filename}`,
        );
      }
      seenSlugs.add(frontmatter.slug);

      if (!includeDrafts && frontmatter.draft) {
        continue;
      }

      const readingMinutes = calculateReadingTime(content);

      articles.push({
        ...frontmatter,
        id: frontmatter.slug,
        body: content,
        readingMinutes,
        url: `/blog/${frontmatter.slug}`,
      });
    }

    // Sort descending by publishedAt
    return articles.sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  return getAllArticles({ includeDrafts: false });
}

export async function getArticleBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<Article | null> {
  if (!slug || !SLUG_REGEX.test(slug)) {
    return null;
  }

  const includeDrafts = options?.includeDrafts ?? false;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  // Path traversal guard
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    return null;
  }

  try {
    const rawContent = await fs.readFile(resolved, "utf-8");
    const { data, content } = matter(rawContent);
    const frontmatter = validateFrontmatter(data, `${slug}.md`);

    if (!includeDrafts && frontmatter.draft) {
      return null;
    }

    const readingMinutes = calculateReadingTime(content);
    const html = await renderMarkdownToHtml(content);

    return {
      ...frontmatter,
      id: frontmatter.slug,
      body: content,
      html,
      readingMinutes,
      url: `/blog/${frontmatter.slug}`,
    };
  } catch {
    return null;
  }
}

export async function getBlogPostsForListing(): Promise<BlogPost[]> {
  const articles = await getPublishedArticles();

  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    url: article.url,
    type: article.type,
    tags: article.tags,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readingMinutes: article.readingMinutes,
    draft: article.draft,
    cover: article.cover,
    canonical: article.canonical,
  }));
}
