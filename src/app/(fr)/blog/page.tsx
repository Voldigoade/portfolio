import type { Metadata } from "next";
import { BlogPageClient } from "@/components/pages/blog-page-client";
import { getBlogPosts } from "@/lib/server/portfolio-data";
import { siteName, siteUrl } from "@/lib/site-config";

const blogOgImageUrl = `${siteUrl}/blog/opengraph-image`;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes techniques, write-ups et retours d'expérience sur les systèmes, la sécurité et l'outillage par Voldigoade.",
  alternates: {
    canonical: "/blog",
    languages: {
      fr: "/blog",
      en: "/en/blog",
      "x-default": "/blog",
    },
  },
  keywords: [
    "Voldigoade blog",
    "articles techniques",
    "recherche sécurité",
    "systèmes",
    "Rust",
    "Linux",
  ],
  openGraph: {
    title: "Blog | Voldigoade",
    description:
      "Notes techniques, write-ups et retours d'expérience sur les systèmes, la sécurité et l'outillage.",
    url: `${siteUrl}/blog`,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: blogOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Voldigoade",
    description:
      "Notes techniques, write-ups et retours d'expérience sur les systèmes, la sécurité et l'outillage.",
    images: [blogOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function safeFetch<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function BlogPage() {
  const posts = await safeFetch([], () => getBlogPosts("fr"));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    url: `${siteUrl}/blog`,
    inLanguage: "fr",
    description:
      "Notes techniques, write-ups et retours d'expérience par Voldigoade.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${post.url}`,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          inLanguage: "fr",
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
          keywords: post.tags.join(", "),
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
    ],
  };

  return (
    <div className="space-y-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <section className="border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
              Blog
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
              Notes techniques, write-ups et retours d'expérience sur les
              systèmes, la sécurité et l'outillage.
            </p>
          </div>
        </div>
      </section>

      <BlogPageClient initialPosts={posts} locale="fr" />
    </div>
  );
}
