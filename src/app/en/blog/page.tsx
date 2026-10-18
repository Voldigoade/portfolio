import type { Metadata } from "next";
import { BlogPageClient } from "@/components/pages/blog-page-client";
import { getBlogPosts } from "@/lib/server/portfolio-data";
import { siteName, siteUrl } from "@/lib/site-config";

const blogOgImageUrl = `${siteUrl}/blog/opengraph-image`;

export const metadata: Metadata = {
  title: "Writing & Research",
  description:
    "Technical articles, security write-ups, research notes and project logs by Voldigoade.",
  alternates: {
    canonical: "/en/blog",
    languages: {
      fr: "/blog",
      en: "/en/blog",
    },
  },
  keywords: [
    "Voldigoade writing",
    "technical write-ups",
    "security research",
    "systems engineering",
    "Rust articles",
    "Linux notes",
  ],
  openGraph: {
    title: "Writing & Research | Voldigoade",
    description:
      "Articles, research notes and project logs on software systems, security and privacy.",
    url: `${siteUrl}/en/blog`,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: blogOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Writing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing & Research | Voldigoade",
    description:
      "Articles, research notes and project logs on software systems, security and privacy.",
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

export default async function EnglishBlogPage() {
  const posts = await safeFetch([], () => getBlogPosts("en"));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing & Research",
    url: `${siteUrl}/en/blog`,
    inLanguage: "en",
    description:
      "Technical writing, security research notes and systems project logs.",
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
          inLanguage: "en",
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
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/en/blog`,
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
        <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
          Writing & Research
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
          First-party technical articles, research write-ups, architecture
          notes, and project engineering logs.
        </p>
      </section>

      <BlogPageClient initialPosts={posts} locale="en" />
    </div>
  );
}
