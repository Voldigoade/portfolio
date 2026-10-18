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
    absolute: "Voldigoade | Systèmes, Logiciels, Sécurité & Confidentialité",
  },
  description:
    "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et les outils développeur par Voldigoade.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Voldigoade",
    "voldigoade.xyz",
    "développeur systèmes",
    "Rust",
    "Linux",
    "recherche sécurité",
    "confidentialité numérique",
    "open source",
  ],
  openGraph: {
    title: "Voldigoade | Systèmes, Logiciels, Sécurité & Confidentialité",
    description:
      "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et les outils développeur.",
    url: siteUrl,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Portfolio Accueil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voldigoade",
    description:
      "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et les outils développeur.",
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
  const [initialRepos, initialPosts, initialGitHubOverview] = await Promise.all(
    [
      safeFetch([], () => getGithubRepos()),
      safeFetch([], () => getBlogPosts("fr")),
      safeFetch(null, () => getGithubOverview()),
    ],
  );

  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Portfolio Voldigoade",
    url: siteUrl,
    inLanguage: "fr",
    description:
      "Portfolio de logiciels, systèmes, sécurité et confidentialité de Voldigoade.",
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
        name: "Statistiques GitHub Voldigoade",
        description:
          "Métriques publiques des dépôts GitHub, étoiles, forks et langages.",
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
        name: "Accueil",
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
        initialGitHubOverview={initialGitHubOverview}
      />
    </>
  );
}
