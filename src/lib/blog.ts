import fs from "node:fs/promises";
import path from "node:path";
import { load } from "js-yaml";
import { Marked, type Tokens } from "marked";
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
// biome-ignore lint/suspicious/noControlCharactersInRegex: URL schemes must reject browser-ignored control characters.
const UNSAFE_URL_CHARACTERS = /[\u0000-\u0020\\]/;

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

  if (
    !Array.isArray(data.tags) ||
    data.tags.length === 0 ||
    data.tags.some((tag) => typeof tag !== "string" || !tag.trim())
  ) {
    errors.push(`'tags' in ${filename} must be an array of strings`);
  }

  const publishedAt = normalizeDate(data.publishedAt);
  const updatedAt =
    data.updatedAt === undefined || data.updatedAt === ""
      ? undefined
      : normalizeDate(data.updatedAt);

  if (!publishedAt) {
    errors.push(
      `Invalid 'publishedAt' date in ${filename}: '${String(data.publishedAt)}'`,
    );
  }

  if (data.updatedAt !== undefined && data.updatedAt !== "" && !updatedAt) {
    errors.push(
      `Invalid 'updatedAt' date in ${filename}: '${String(data.updatedAt)}'`,
    );
  }

  if (typeof data.draft !== "boolean") {
    errors.push(`'draft' in ${filename} must be a boolean (true or false)`);
  }

  if (
    data.cover !== undefined &&
    data.cover !== "" &&
    (typeof data.cover !== "string" || !isWritingImage(data.cover))
  ) {
    errors.push(
      `'cover' in ${filename} must be a raster image under /images/writing/`,
    );
  }

  if (
    data.canonical !== undefined &&
    data.canonical !== "" &&
    (typeof data.canonical !== "string" || !isHttpUrl(data.canonical))
  ) {
    errors.push(`'canonical' in ${filename} must be an absolute HTTP(S) URL`);
  }

  if (errors.length > 0) {
    throw new Error(`Frontmatter validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    title: (data.title as string).trim(),
    slug: (data.slug as string).trim(),
    summary: (data.summary as string).trim(),
    type: data.type as WritingType,
    tags: [...new Set((data.tags as string[]).map((tag) => tag.trim()))],
    publishedAt: publishedAt as string,
    updatedAt,
    draft: Boolean(data.draft),
    cover: data.cover ? String(data.cover).trim() : undefined,
    canonical: data.canonical ? String(data.canonical).trim() : undefined,
  };
}

function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  }
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(value)
  )
    return undefined;
  const date = new Date(value);
  // Date.parse silently rolls dates such as February 31 into the following month.
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value.slice(0, 10)
  )
    return undefined;
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isHttpUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value) || UNSAFE_URL_CHARACTERS.test(value))
    return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isWritingImage(value: string): boolean {
  return /^\/images\/writing\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-][a-zA-Z0-9_.-]*\.(?:png|jpe?g|webp|avif)$/i.test(
    value,
  );
}

function isSafeLink(value: string): boolean {
  if (UNSAFE_URL_CHARACTERS.test(value)) return false;
  return (
    isHttpUrl(value) ||
    /^mailto:[^<>"\s]+$/i.test(value) ||
    /^\/(?![/%&])/.test(value) ||
    value.startsWith("#")
  );
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  // Raw HTML is text. Marked owns all ordinary tag/attribute escaping; only
  // its link/image destinations need an explicit policy. Shiki HTML is trusted
  // output from code tokens, never substituted into user-controlled text.
  const highlighted = new Map<Tokens.Code, string>();
  const marked = new Marked({
    async: true,
    async walkTokens(token) {
      if (token.type !== "code") return;
      const code = token as Tokens.Code;
      try {
        highlighted.set(
          code,
          await codeToHtml(code.text, {
            lang: code.lang?.split(/\s+/)[0] || "text",
            theme: "nord",
          }),
        );
      } catch {
        highlighted.set(
          code,
          `<pre class="border-2 border-black bg-muted p-4 overflow-x-auto"><code>${escapeHtml(code.text)}</code></pre>`,
        );
      }
    },
    renderer: {
      code(token) {
        return (
          highlighted.get(token) ||
          `<pre><code>${escapeHtml(token.text)}</code></pre>`
        );
      },
      html({ text }) {
        return escapeHtml(text);
      },
      link(token) {
        return isSafeLink(token.href)
          ? false
          : this.parser.parseInline(token.tokens);
      },
      image(token) {
        return isWritingImage(token.href) ? false : escapeHtml(token.text);
      },
    },
  });
  return marked.parse(markdown, { async: true });
}

function parseYamlFrontmatter(source: string) {
  const normalized = source.replace(/^\uFEFF/, "");
  const opening = /^---\r?\n/.exec(normalized);
  const remainder = opening ? normalized.slice(opening[0].length) : "";
  const closing = /(?:^|\r?\n)---(?:\r?\n|$)/.exec(remainder);
  // Only a complete YAML fence is accepted. No content-selected parser or
  // executable frontmatter engine participates in this pipeline.
  if (!opening || !closing) {
    throw new Error(
      "Articles require complete YAML frontmatter delimited by ---",
    );
  }
  const data: unknown = load(remainder.slice(0, closing.index));
  if (
    data === null ||
    typeof data !== "object" ||
    (Object.getPrototypeOf(data) !== Object.prototype &&
      Object.getPrototypeOf(data) !== null)
  ) {
    throw new Error("Article YAML frontmatter must be a mapping object");
  }
  return {
    data: data as Record<string, unknown>,
    content: remainder.slice(closing.index + closing[0].length),
  };
}

export interface ArticleSource {
  filename: string;
  content: string;
}

export function parseArticleSources(
  sources: ArticleSource[],
  options?: { includeDrafts?: boolean },
): Article[] {
  const seenSlugs = new Set<string>();
  const articles: Article[] = [];
  for (const source of sources) {
    const { data, content } = parseYamlFrontmatter(source.content);
    const frontmatter = validateFrontmatter(data, source.filename);
    if (seenSlugs.has(frontmatter.slug))
      throw new Error(
        `Duplicate slug '${frontmatter.slug}' found in ${source.filename}`,
      );
    seenSlugs.add(frontmatter.slug);
    if (frontmatter.draft && !options?.includeDrafts) continue;
    articles.push({
      ...frontmatter,
      id: frontmatter.slug,
      body: content,
      readingMinutes: calculateReadingTime(content),
      url: `/blog/${frontmatter.slug}`,
    });
  }
  return articles.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function getAllArticles(options?: {
  includeDrafts?: boolean;
}): Promise<Article[]> {
  try {
    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    const sources = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map(async (entry) => ({
          filename: entry.name,
          content: await fs.readFile(
            path.join(CONTENT_DIR, entry.name),
            "utf-8",
          ),
        })),
    );
    return parseArticleSources(sources, options);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
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
    const article = parseArticleSources(
      [{ filename: `${slug}.md`, content: rawContent }],
      { includeDrafts },
    )[0];
    if (!article) return null;
    return { ...article, html: await renderMarkdownToHtml(article.body) };
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
