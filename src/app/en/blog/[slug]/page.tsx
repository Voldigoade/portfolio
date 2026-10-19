import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLanguageSwitcher } from "@/components/portfolio/article-language-switcher";
import { Button } from "@/components/retroui/Button";
import {
  formatArticleDate,
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/blog";
import { githubUrl, siteName, siteUrl } from "@/lib/site-config";

interface EnglishArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getPublishedArticles("en");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: EnglishArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "en", { includeDrafts: false });

  if (!article) {
    notFound();
  }

  const canonicalUrl =
    article.canonical || `${siteUrl}/en/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/blog/${article.slug}`,
        ...(article.translationSlug
          ? { fr: `${siteUrl}/blog/${article.translationSlug}` }
          : {}),
      },
    },
    keywords: article.tags,
    openGraph: {
      title: `${article.title} | ${siteName}`,
      description: article.summary,
      url: `${siteUrl}/en/blog/${article.slug}`,
      type: "article",
      locale: "en_US",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [siteName],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function EnglishArticlePage({
  params,
}: EnglishArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "en", { includeDrafts: false });

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: "en",
    url: `${siteUrl}/en/blog/${article.slug}`,
    author: {
      "@type": "Person",
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteName,
      url: siteUrl,
    },
    keywords: article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/en/blog/${article.slug}`,
    },
  };

  return (
    <article className="space-y-6 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          asChild
          variant="secondary"
          className="border-4 border-black uppercase shadow-retro-sm"
        >
          <Link href="/en/blog">← All Writing</Link>
        </Button>
        <div className="flex items-center gap-3">
          <ArticleLanguageSwitcher
            currentLocale="en"
            translationSlug={article.translationSlug}
          />
          {article.category ? (
            <span className="border-2 border-black bg-accent px-3 py-1 font-pixel text-xs uppercase text-accent-foreground">
              {article.category}
            </span>
          ) : null}
        </div>
      </div>

      <header className="border-4 border-black bg-card p-6 shadow-retro-lg sm:p-8 md:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase text-muted-foreground">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt, "en")}
          </time>
          <span>•</span>
          <span>{article.readingTimeText}</span>
          {article.updatedAt ? (
            <>
              <span>•</span>
              <span>Updated: {formatArticleDate(article.updatedAt, "en")}</span>
            </>
          ) : null}
        </div>
        <h1 className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl">
          {article.title}
        </h1>
        <p className="text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
          {article.summary}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {article.tags.map((tag) => (
            <span key={tag} className="retro-badge text-xs">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="border-4 border-black bg-card p-6 shadow-retro-lg sm:p-8 md:p-10">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none font-medium leading-relaxed
            prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-a:font-black prose-a:underline hover:prose-a:text-primary
            prose-table:border-4 prose-table:border-black prose-th:border-2 prose-th:border-black prose-th:bg-muted prose-th:p-2
            prose-td:border-2 prose-td:border-black prose-td:p-2
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-muted prose-blockquote:p-4 prose-blockquote:font-bold"
          dangerouslySetInnerHTML={{ __html: article.html || "" }}
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-4 border-black bg-card p-4 shadow-retro-sm">
        <Button
          asChild
          variant="secondary"
          className="border-2 border-black uppercase shadow-retro-xs"
        >
          <Link href="/en/blog">Back to All Articles</Link>
        </Button>
        <Button
          asChild
          className="border-2 border-black uppercase shadow-retro-xs"
        >
          <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
            View on GitHub
          </Link>
        </Button>
      </footer>
    </article>
  );
}
