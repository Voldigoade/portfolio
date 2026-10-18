import type { Metadata } from "next";
import { ProjectPageClient } from "@/components/pages/project-page-client";
import { getGithubRepos } from "@/lib/server/portfolio-data";
import { siteUrl } from "@/lib/site-config";

const projectOgImageUrl = `${siteUrl}/project/opengraph-image`;

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Sélection de systèmes open-source, outils de sécurité et dépôts de recherche par Voldigoade.",
  alternates: {
    canonical: "/project",
  },
  keywords: [
    "projets github",
    "ingénierie systèmes",
    "recherche sécurité",
    "spoor",
    "dépôts open source",
    "outillage rust",
  ],
  openGraph: {
    title: "Projets | Voldigoade",
    description:
      "Explorer les systèmes open-source, outils d'audit d'empreinte et dépôts de recherche.",
    url: `${siteUrl}/project`,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: projectOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Projets Voldigoade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projets | Voldigoade",
    description:
      "Explorer les systèmes open-source, outils d'audit d'empreinte et dépôts de recherche.",
    images: [projectOgImageUrl],
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

export default async function ProjectPage() {
  const repos = await safeFetch([], () => getGithubRepos());

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projets de Voldigoade",
    url: `${siteUrl}/project`,
    inLanguage: "fr",
    description:
      "Sélection de dépôts open-source et travaux d'ingénierie des systèmes.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: repos.map((repo, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: repo.html_url,
        item: {
          "@type": "SoftwareSourceCode",
          name: repo.name,
          codeRepository: repo.html_url,
          description: repo.description ?? "Pas de description fournie.",
          programmingLanguage: repo.language ?? "Mixte",
          author: {
            "@type": "Person",
            name: "Voldigoade",
            url: siteUrl,
          },
          publisher: {
            "@type": "Person",
            name: "Voldigoade",
            url: siteUrl,
          },
          keywords: (repo.topics ?? []).join(", "),
          dateModified: repo.updated_at,
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
        name: "Projets",
        item: `${siteUrl}/project`,
      },
    ],
  };

  return (
    <div className="space-y-6 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <section className="border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6 md:p-8">
        <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
          Projets
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed sm:text-base">
          Sélection de systèmes open-source, outils d&apos;inspection
          d&apos;empreinte numérique et dépôts de recherche. Filtrez par tag et
          recherchez parmi les dépôts.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl uppercase sm:text-3xl">
          Index des Projets
        </h2>
        <p className="text-sm font-medium leading-relaxed sm:text-base">
          Filtrez par thématique, inspectez les étoiles et l&apos;activité
          récente, et accédez au code source ou à la documentation en ligne.
        </p>
      </section>

      <ProjectPageClient initialRepos={repos} />
    </div>
  );
}
