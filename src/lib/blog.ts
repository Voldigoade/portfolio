import fs from "node:fs/promises";
import path from "node:path";
import { load } from "js-yaml";
import { Marked, type Tokens } from "marked";
import { codeToHtml } from "shiki";
import type { BlogPost, WritingLocale } from "@/lib/portfolio-types";

export type { WritingLocale };

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// biome-ignore lint/suspicious/noControlCharactersInRegex: URL schemes must reject browser-ignored control characters.
const UNSAFE_URL_CHARACTERS = /[\u0000-\u0020\\]/;

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  series?: string;
  publishedAt: string;
  updatedAt?: string;
  eventDate?: string;
  draft: boolean;
  cover?: string;
  canonical?: string;
  frenchVersion?: string;
  translationSlug?: string;
}

export interface Article extends ArticleFrontmatter {
  id: string;
  locale: WritingLocale;
  body: string;
  html?: string;
  readingMinutes: number;
  readingTimeText: string;
  url: string;
}

const CONTENT_DIR_FR = path.join(process.cwd(), "content", "writing", "fr");
const CONTENT_DIR_EN = path.join(process.cwd(), "content", "writing", "en");

export function getContentDir(locale: WritingLocale = "fr"): string {
  return locale === "en" ? CONTENT_DIR_EN : CONTENT_DIR_FR;
}

export function calculateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}

export function calculateReadingTimeText(
  content: string,
  locale: WritingLocale = "fr",
): string {
  const minutes = calculateReadingMinutes(content);
  return locale === "en" ? `${minutes} min read` : `${minutes} min de lecture`;
}

// Backwards-compatible signature
export function calculateReadingTime(content: string): number {
  return calculateReadingMinutes(content);
}

export function normalizeTranslationRef(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const cleaned = value
    .trim()
    .replace(/^.*[\\/]/, "")
    .replace(/\.md$/, "");
  return SLUG_REGEX.test(cleaned) ? cleaned : undefined;
}

export function validateFrontmatter(
  data: Record<string, unknown>,
  filename: string,
  locale: WritingLocale = "fr",
): ArticleFrontmatter {
  const errors: string[] = [];

  const cleanedFilename = filename.replace(/\.md$/, "");
  if (!SLUG_REGEX.test(cleanedFilename)) {
    errors.push(
      `Filename '${filename}' produces an invalid slug '${cleanedFilename}'. Use lowercase alphanumeric letters and single hyphens.`,
    );
  }
  const derivedSlug = path.basename(filename, ".md");

  if (typeof data.title !== "string" || !data.title.trim()) {
    errors.push(`Missing or invalid 'title' in ${filename}`);
  }

  // If frontmatter provides slug, it must match the filename slug
  if (data.slug !== undefined && data.slug !== "") {
    if (typeof data.slug !== "string" || !SLUG_REGEX.test(data.slug)) {
      errors.push(
        `Invalid 'slug' in ${filename}. Must be lowercase alphanumeric with hyphens (received: ${String(data.slug)})`,
      );
    } else if (data.slug !== derivedSlug) {
      errors.push(
        `Filename / slug mismatch in ${filename}: filename is '${derivedSlug}.md' but frontmatter slug is '${String(data.slug)}'`,
      );
    }
  }

  if (typeof data.summary !== "string" || !data.summary.trim()) {
    errors.push(`Missing or invalid 'summary' in ${filename}`);
  }

  const defaultCategory = locale === "en" ? "Systems" : "Systèmes";
  let category = defaultCategory;
  if (data.category !== undefined) {
    if (typeof data.category !== "string" || !data.category.trim()) {
      errors.push(`'category' in ${filename} must be a non-empty string`);
    } else {
      category = data.category.trim();
    }
  }

  let tags: string[] = [];
  if (data.tags !== undefined) {
    if (
      !Array.isArray(data.tags) ||
      data.tags.some((tag) => typeof tag !== "string" || !tag.trim())
    ) {
      errors.push(
        `'tags' in ${filename} must be an array of non-empty strings`,
      );
    } else {
      tags = [...new Set((data.tags as string[]).map((tag) => tag.trim()))];
    }
  }

  let series: string | undefined;
  if (data.series !== undefined && data.series !== "") {
    if (typeof data.series !== "string" || !data.series.trim()) {
      errors.push(`'series' in ${filename} must be a string`);
    } else {
      series = data.series.trim();
    }
  }

  const publishedAt = normalizeDate(data.publishedAt);
  const updatedAt =
    data.updatedAt === undefined || data.updatedAt === ""
      ? undefined
      : normalizeDate(data.updatedAt);
  const eventDate =
    data.eventDate === undefined || data.eventDate === ""
      ? undefined
      : normalizeDate(data.eventDate);

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

  if (data.eventDate !== undefined && data.eventDate !== "" && !eventDate) {
    errors.push(
      `Invalid 'eventDate' date in ${filename}: '${String(data.eventDate)}'`,
    );
  }

  // Draft defaults to true for safety
  const draft = data.draft === undefined ? true : Boolean(data.draft);
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
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

  const frenchVersion = normalizeTranslationRef(data.frenchVersion);

  if (errors.length > 0) {
    throw new Error(`Frontmatter validation failed:\n- ${errors.join("\n- ")}`);
  }

  return {
    title: (data.title as string).trim(),
    slug: derivedSlug,
    summary: (data.summary as string).trim(),
    category,
    tags,
    series,
    publishedAt: publishedAt as string,
    updatedAt,
    eventDate,
    draft,
    cover: data.cover ? String(data.cover).trim() : undefined,
    canonical: data.canonical ? String(data.canonical).trim() : undefined,
    frenchVersion,
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

export function parseYamlFrontmatter(source: string) {
  const normalized = source.replace(/^\uFEFF/, "");
  const opening = /^---\r?\n/.exec(normalized);
  const remainder = opening ? normalized.slice(opening[0].length) : "";
  const closing = /(?:^|\r?\n)---(?:\r?\n|$)/.exec(remainder);
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
  locale?: WritingLocale;
}

export function parseArticleSources(
  sources: ArticleSource[],
  options?: { includeDrafts?: boolean; locale?: WritingLocale },
): Article[] {
  const defaultLocale = options?.locale ?? "fr";
  const seenSlugs = new Set<string>();
  const articles: Article[] = [];

  for (const source of sources) {
    const locale = source.locale ?? defaultLocale;
    const { data, content } = parseYamlFrontmatter(source.content);
    const frontmatter = validateFrontmatter(data, source.filename, locale);
    if (seenSlugs.has(frontmatter.slug)) {
      throw new Error(
        `Duplicate slug '${frontmatter.slug}' found in ${source.filename}`,
      );
    }
    seenSlugs.add(frontmatter.slug);
    if (frontmatter.draft && !options?.includeDrafts) continue;

    const url =
      locale === "en"
        ? `/en/blog/${frontmatter.slug}`
        : `/blog/${frontmatter.slug}`;

    articles.push({
      ...frontmatter,
      id: frontmatter.slug,
      locale,
      body: content,
      readingMinutes: calculateReadingMinutes(content),
      readingTimeText: calculateReadingTimeText(content, locale),
      url,
    });
  }

  return articles.sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function readDirSources(
  dir: string,
  locale: WritingLocale,
): Promise<ArticleSource[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return await Promise.all(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map(async (entry) => ({
          filename: entry.name,
          locale,
          content: await fs.readFile(path.join(dir, entry.name), "utf-8"),
        })),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getAllArticles(options?: {
  locale?: WritingLocale;
  includeDrafts?: boolean;
}): Promise<Article[]> {
  const targetLocale = options?.locale ?? "fr";
  const includeDrafts = options?.includeDrafts ?? false;

  // Read both collections to wire bidirectional translations
  const [frSources, enSources] = await Promise.all([
    readDirSources(CONTENT_DIR_FR, "fr"),
    readDirSources(CONTENT_DIR_EN, "en"),
  ]);

  const frArticles = parseArticleSources(frSources, {
    locale: "fr",
    includeDrafts,
  });
  const enArticles = parseArticleSources(enSources, {
    locale: "en",
    includeDrafts,
  });

  // Bidirectional resolution:
  // For each EN article: if it has frenchVersion, link to FR article with that slug;
  // otherwise if a FR article shares the exact same slug, link them.
  const frBySlug = new Map<string, Article>(frArticles.map((a) => [a.slug, a]));

  for (const enArticle of enArticles) {
    const targetFrSlug = enArticle.frenchVersion || enArticle.slug;
    const matchedFr = frBySlug.get(targetFrSlug);
    if (matchedFr) {
      enArticle.translationSlug = matchedFr.slug;
      matchedFr.translationSlug = enArticle.slug;
    }
  }

  return targetLocale === "en" ? enArticles : frArticles;
}

export async function getPublishedArticles(
  locale: WritingLocale = "fr",
): Promise<Article[]> {
  return getAllArticles({ locale, includeDrafts: false });
}

export async function getArticleBySlug(
  slug: string,
  locale: WritingLocale = "fr",
  options?: { includeDrafts?: boolean },
): Promise<Article | null> {
  if (!slug || !SLUG_REGEX.test(slug)) {
    return null;
  }

  const articles = await getAllArticles({
    locale,
    includeDrafts: options?.includeDrafts,
  });
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  return {
    ...article,
    html: await renderMarkdownToHtml(article.body),
  };
}

export async function getBlogPostsForListing(
  locale: WritingLocale = "fr",
): Promise<BlogPost[]> {
  const articles = await getPublishedArticles(locale);

  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    locale: article.locale,
    title: article.title,
    excerpt: article.summary,
    url: article.url,
    category: article.category,
    series: article.series,
    tags: article.tags,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    eventDate: article.eventDate,
    readingMinutes: article.readingMinutes,
    readingTimeText: article.readingTimeText,
    draft: article.draft,
    cover: article.cover,
    canonical: article.canonical,
    frenchVersion: article.frenchVersion,
    translationSlug: article.translationSlug,
  }));
}

export async function getAllCategories(
  locale: WritingLocale = "fr",
): Promise<string[]> {
  const articles = await getPublishedArticles(locale);
  const categories = new Set<string>();
  for (const a of articles) {
    if (a.category) categories.add(a.category);
  }
  return Array.from(categories);
}

export async function getAllTags(
  locale: WritingLocale = "fr",
): Promise<string[]> {
  const articles = await getPublishedArticles(locale);
  const tags = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) tags.add(t);
  }
  return Array.from(tags);
}
