import type { Metadata } from "next";
import { ProjectPageClient } from "@/components/pages/project-page-client";
import { getGithubRepos } from "@/lib/server/portfolio-data";
import { siteUrl } from "@/lib/site-config";

const projectOgImageUrl = `${siteUrl}/project/opengraph-image`;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Open-source tools, Rust CLIs, and technical research published by Voldigoade.",
  alternates: {
    canonical: "/en/project",
    languages: {
      fr: "/project",
      en: "/en/project",
      "x-default": "/project",
    },
  },
  keywords: [
    "github projects",
    "rust",
    "linux",
    "cli",
    "osint",
    "security",
    "spoor",
    "crucksware",
    "open source",
  ],
  openGraph: {
    title: "Projects | Voldigoade",
    description:
      "Explore open-source tools in Rust, footprint inspection, and research repositories.",
    url: `${siteUrl}/en/project`,
    type: "website",
    locale: "en_US",
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
      "Explore open-source tools in Rust, footprint inspection, and research repositories.",
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

export default async function EnglishProjectPage() {
  const repos = await safeFetch([], () => getGithubRepos("en"));

  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Voldigoade Projects",
    url: `${siteUrl}/en/project`,
    inLanguage: "en",
    description:
      "Curated open source repositories, Rust CLI tools and research projects.",
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
          description:
            repo.description_en ??
            repo.description ??
            "No description provided.",
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
        item: `${siteUrl}/en`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/en/project`,
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
          Projects
        </h1>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed sm:text-base">
          Open-source tools, Rust CLIs, and technical research published by
          Voldigoade. Filter by tag and explore the source code directly.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-2xl uppercase sm:text-3xl">
          Project Index
        </h2>
        <p className="text-sm font-medium leading-relaxed sm:text-base">
          Filter by topic, check stars and latest activity, and jump directly to
          the corresponding GitHub repository.
        </p>
      </section>

      <ProjectPageClient initialRepos={repos} locale="en" />
    </div>
  );
}
