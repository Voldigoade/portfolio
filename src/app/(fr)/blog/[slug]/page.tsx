import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEnhancements } from "@/components/portfolio/article-enhancements";
import { ArticleNavbarSync } from "@/components/portfolio/article-navbar-sync";
import { ArticleShare } from "@/components/portfolio/article-share";
import { ArticleToc } from "@/components/portfolio/article-toc";
import { Button } from "@/components/retroui/Button";
import {
  formatArticleDate,
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/blog";
import { githubUrl, siteName, siteUrl } from "@/lib/site-config";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getPublishedArticles("fr");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "fr", { includeDrafts: false });

  if (!article) {
    notFound();
  }

  const canonicalUrl = article.canonical || `${siteUrl}/blog/${article.slug}`;
  const ogImageUrl = article.cover
    ? `${siteUrl}${article.cover}`
    : `${siteUrl}/api/og/article?slug=${article.slug}&locale=fr`;

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${siteUrl}/blog/${article.slug}`,
        ...(article.translationSlug
          ? { en: `${siteUrl}/en/blog/${article.translationSlug}` }
          : {}),
      },
    },
    keywords: article.tags,
    openGraph: {
      title: `${article.title} | ${siteName}`,
      description: article.summary,
      url: `${siteUrl}/blog/${article.slug}`,
      type: "article",
      locale: "fr_FR",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [siteName],
      tags: article.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, "fr", { includeDrafts: false });

  if (!article) {
    notFound();
  }

  const canonicalUrl = article.canonical || `${siteUrl}/blog/${article.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: "fr",
    url: `${siteUrl}/blog/${article.slug}`,
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
      "@id": `${siteUrl}/blog/${article.slug}`,
    },
  };

  return (
    <article className="space-y-6 pb-20">
      <ArticleNavbarSync translationSlug={article.translationSlug} />
      <ArticleEnhancements locale="fr" />

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
          <Link href="/blog">← Tous les articles</Link>
        </Button>
        <div className="flex items-center gap-3">
          {article.category ? (
            <span className="border-2 border-black bg-accent px-3 py-1 font-pixel text-xs uppercase text-accent-foreground shadow-retro-xs">
              {article.category}
            </span>
          ) : null}
          <ArticleShare
            title={article.title}
            summary={article.summary}
            canonicalUrl={canonicalUrl}
            locale="fr"
          />
        </div>
      </div>

      <header className="border-4 border-black bg-card p-6 shadow-retro-lg sm:p-8 md:p-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase text-muted-foreground">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt, "fr")}
          </time>
          <span>•</span>
          <span>{article.readingTimeText}</span>
          {article.updatedAt ? (
            <>
              <span>•</span>
              <span>
                Mis à jour : {formatArticleDate(article.updatedAt, "fr")}
              </span>
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

      {article.toc && article.toc.length >= 3 ? (
        <ArticleToc items={article.toc} locale="fr" />
      ) : null}

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

      {article.seriesNav ? (
        <nav
          aria-label="Navigation de la série"
          className="border-4 border-black bg-card p-5 sm:p-6 shadow-retro-sm space-y-3"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="font-pixel text-xs uppercase font-bold text-muted-foreground">
              Série : {article.seriesNav.seriesName}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {article.seriesNav.previousArticle ? (
              <Link
                href={article.seriesNav.previousArticle.url}
                className="group border-2 border-black bg-muted p-3 hover:bg-primary hover:text-primary-foreground transition shadow-retro-xs"
              >
                <span className="block text-xs uppercase font-black text-muted-foreground group-hover:text-primary-foreground">
                  ← Article précédent
                </span>
                <span className="mt-1 block font-bold text-sm line-clamp-2">
                  {article.seriesNav.previousArticle.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {article.seriesNav.nextArticle ? (
              <Link
                href={article.seriesNav.nextArticle.url}
                className="group border-2 border-black bg-muted p-3 hover:bg-primary hover:text-primary-foreground transition shadow-retro-xs sm:text-right"
              >
                <span className="block text-xs uppercase font-black text-muted-foreground group-hover:text-primary-foreground">
                  Article suivant →
                </span>
                <span className="mt-1 block font-bold text-sm line-clamp-2">
                  {article.seriesNav.nextArticle.title}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-4 border-4 border-black bg-card p-4 shadow-retro-sm">
        <Button
          asChild
          variant="secondary"
          className="border-2 border-black uppercase shadow-retro-xs"
        >
          <Link href="/blog">Retour aux articles</Link>
        </Button>
        <div className="flex items-center gap-3">
          <ArticleShare
            title={article.title}
            summary={article.summary}
            canonicalUrl={canonicalUrl}
            locale="fr"
          />
          <Button
            asChild
            className="border-2 border-black uppercase shadow-retro-xs"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              Voir sur GitHub
            </Link>
          </Button>
        </div>
      </footer>
    </article>
  );
}
