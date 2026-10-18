import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/about-page-client";
import type { TimelineItem } from "@/components/portfolio/about-timeline";
import { siteUrl } from "@/lib/site-config";

const aboutOgImageUrl = `${siteUrl}/about/opengraph-image`;

export const metadata: Metadata = {
  title: "About",
  description: "Public projects and technical interests of Voldigoade.",
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "about voldigoade",
    "systems engineering",
    "rust",
    "security research",
    "public projects",
    "spoor",
  ],
  openGraph: {
    title: "About Voldigoade",
    description:
      "Explore public Rust tools and source-linked research into messaging and development environments.",
    url: `${siteUrl}/about`,
    type: "profile",
    images: [
      {
        url: aboutOgImageUrl,
        width: 1200,
        height: 630,
        alt: "About Voldigoade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Voldigoade",
    description:
      "Explore public Rust tools and source-linked research into messaging and development environments.",
    images: [aboutOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const timelineItems: TimelineItem[] = [
  {
    period: "Rust tooling",
    title: "Spoor",
    url: "https://github.com/Voldigoade/spoor",
    description:
      "A terminal-first tool for inspecting public GitHub profiles, repositories, commit identities, and keys.",
    highlights: [
      "Reports distinguish observed data, derived values, and inferences.",
      "Command-line exports and an HTTP lookup service are documented in the repository.",
      "Scan bounds, cache age, and provider availability limit the results.",
    ],
  },
  {
    period: "Messaging research",
    title: "Recherche Messageries",
    url: "https://github.com/Voldigoade/recherche-messageries",
    description:
      "A source-driven comparison of secure messaging systems across content security, metadata, pseudonymity, network exposure, and threat models.",
    highlights: [
      "Links public documentation, audits, advisories, and other evidence.",
      "Recommendations depend on the platform, configuration, and adversary.",
      "The study explicitly describes its limits; it is not a security certification.",
    ],
  },
  {
    period: "Developer environments",
    title: "IDE Research",
    url: "https://github.com/Voldigoade/ide-research",
    description:
      "A source-linked comparison of development environments across stacks, remote work, AI tooling, security, privacy, and licensing.",
    highlights: [
      "Includes a method, evidence register, chooser, and comparator.",
      "Editorial scores are conditional comparisons, not benchmark results.",
      "Research content and code have separate license terms.",
    ],
  },
  {
    period: "Experimental foundation",
    title: "Crukst",
    url: "https://github.com/Voldigoade/crukst",
    description:
      "An early Rust project foundation and proposed design for semantic firmware comparison and triage.",
    highlights: [
      "Firmware and filesystem comparison are not implemented yet.",
      "The README separates planned features from current behavior.",
    ],
  },
];

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Voldigoade",
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Person",
      name: "Voldigoade",
      url: siteUrl,
    },
  };

  return (
    <>
      <script type="application/ld+json">{serializeJsonLd(aboutJsonLd)}</script>
      <AboutPageClient timelineItems={timelineItems} />
    </>
  );
}
