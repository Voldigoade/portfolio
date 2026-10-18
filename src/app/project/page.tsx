import type { Metadata } from "next";
import { ProjectPageClient } from "@/components/pages/project-page-client";
import { getGithubRepos } from "@/lib/server/portfolio-data";
import { siteUrl } from "@/lib/site-config";

const projectOgImageUrl = `${siteUrl}/project/opengraph-image`;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Curated open-source systems, security research, and developer tooling by Voldigoade.",
  alternates: {
    canonical: "/project",
  },
  keywords: [
    "github projects",
    "systems engineering",
    "security research",
    "spoor",
    "open source repositories",
    "rust tooling",
  ],
  openGraph: {
    title: "Projects | Voldigoade",
    description:
      "Explore open-source systems, security auditing tools, and research repositories with topic filters and search.",
    url: `${siteUrl}/project`,
    type: "website",
    images: [
      {
        url: projectOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Voldigoade",
    description:
      "Explore open-source systems, security auditing tools, and research repositories with topic filters and search.",
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
    name: "Projects by Voldigoade",
    url: `${siteUrl}/project`,
    description:
      "Curated open-source repositories and systems engineering work.",
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
          description: repo.description ?? "No description provided.",
          programmingLanguage: repo.language ?? "Mixed",
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
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/project`,
      },
    ],
  };

  return (
    <div className="space-y-6 pb-16">
      <script type="application/ld+json">
        {serializeJsonLd(projectsJsonLd)}
      </script>
      <script type="application/ld+json">
        {serializeJsonLd(breadcrumbJsonLd)}
      </script>
      <section className="border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6 md:p-8">
        <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
          Projects
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed sm:text-base">
          Curated open-source systems, footprint auditing utilities, and
          research repositories. Filter by topic and search across projects.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl uppercase sm:text-3xl">
          Browse Project Index
        </h2>
        <p className="text-sm font-medium leading-relaxed sm:text-base">
          Filter by topic, inspect star activity or recency, and open source
          repositories or live documentation.
        </p>
      </section>

      <ProjectPageClient initialRepos={repos} />
    </div>
  );
}
