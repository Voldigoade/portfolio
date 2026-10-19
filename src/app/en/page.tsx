import type { Metadata } from "next";
import { HomePageClient } from "@/components/portfolio/home-page-client";
import {
  getBlogPosts,
  getGithubOverview,
  getGithubRepos,
} from "@/lib/server/portfolio-data";
import { githubUrl, ogImageUrl, siteName, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Voldigoade | Systems, Software, Security & Privacy",
  },
  description:
    "Open-source software projects and documented technical research on systems, security, privacy and developer tooling by Voldigoade.",
  alternates: {
    canonical: "/en",
    languages: {
      fr: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  keywords: [
    "Voldigoade",
    "voldigoade.xyz",
    "systems developer",
    "Rust",
    "Linux",
    "security research",
    "digital privacy",
    "open source",
  ],
  openGraph: {
    title: "Voldigoade | Systems, Software, Security & Privacy",
    description:
      "Open-source software projects and documented technical research on systems, security, privacy and developer tooling.",
    url: `${siteUrl}/en`,
    type: "website",
    locale: "en_US",
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
      "Open-source software projects and documented technical research on systems, security, privacy and developer tooling.",
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

export default async function EnglishHomePage() {
  const [initialRepos, initialPosts, initialGitHubOverview] = await Promise.all(
    [
      safeFetch([], () => getGithubRepos("en")),
      safeFetch([], () => getBlogPosts("en")),
      safeFetch(null, () => getGithubOverview()),
    ],
  );

  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Voldigoade Portfolio",
    url: `${siteUrl}/en`,
    inLanguage: "en",
    description:
      "Software, systems, security and privacy portfolio by Voldigoade.",
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
        name: "Voldigoade GitHub Statistics",
        description:
          "Public metrics for GitHub repositories, stars, forks and languages.",
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
        item: `${siteUrl}/en`,
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
        initialGitHubOverview={initialGitHubOverview}
        locale="en"
      />
    </>
  );
}
