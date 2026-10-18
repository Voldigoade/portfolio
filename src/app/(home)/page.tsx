import type { Metadata } from "next";
import { HomePageClient } from "@/components/portfolio/home-page-client";
import {
  getBlogPosts,
  getGithubOverview,
  getGithubRepos,
  getHackatimeStats,
} from "@/lib/server/portfolio-data";
import { githubUrl, ogImageUrl, siteName, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Voldigoade | Software, Systems, Security and Privacy",
  },
  description:
    "Software, systems, security and privacy. Systems software in Rust, Python, and TypeScript by Voldigoade.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Voldigoade",
    "voldigoade.xyz",
    "systems developer",
    "Rust",
    "Linux",
    "security research",
    "privacy engineering",
    "open source",
  ],
  openGraph: {
    title: "Voldigoade | Software, Systems, Security and Privacy",
    description:
      "Software, systems, security and privacy. Systems software in Rust, Python, and TypeScript.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Portfolio Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voldigoade",
    description:
      "Software, systems, security and privacy. Systems software in Rust, Python, and TypeScript.",
    images: [ogImageUrl],
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

export default async function HomePage() {
  const [initialRepos, initialPosts, initialHackatime, initialGitHubOverview] =
    await Promise.all([
      safeFetch([], () => getGithubRepos()),
      safeFetch([], () => getBlogPosts()),
      safeFetch(null, () => getHackatimeStats()),
      safeFetch(null, () => getGithubOverview()),
    ]);

  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Voldigoade Portfolio",
    url: siteUrl,
    description:
      "Software, systems, security and privacy portfolio of Voldigoade.",
    mainEntity: {
      "@type": "Person",
      name: siteName,
      url: siteUrl,
      sameAs: [githubUrl],
    },
  };

  const profileStatsJsonLd = initialGitHubOverview
    ? {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "Voldigoade GitHub Portfolio Stats",
        description:
          "Public GitHub repository, stars, forks, and language metrics.",
        license: "https://opensource.org/licenses/MIT",
        creator: {
          "@type": "Person",
          name: siteName,
        },
        distribution: {
          "@type": "DataDownload",
          contentUrl: `${siteUrl}/api/portfolio/github-overview`,
          encodingFormat: "application/json",
        },
      }
    : null;

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homepageJsonLd) }}
      />
      {profileStatsJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(profileStatsJsonLd),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <HomePageClient
        initialRepos={initialRepos}
        initialPosts={initialPosts}
        initialHackatime={initialHackatime}
        initialGitHubOverview={initialGitHubOverview}
      />
    </>
  );
}
