import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/about-page-client";
import type { TimelineItem } from "@/components/portfolio/about-timeline";
import { siteUrl } from "@/lib/site-config";

const aboutOgImageUrl = `${siteUrl}/about/opengraph-image`;

export const metadata: Metadata = {
  title: "About",
  description:
    "Public projects, technical methodology, and research topics by Voldigoade.",
  alternates: {
    canonical: "/en/about",
    languages: {
      fr: "/about",
      en: "/en/about",
      "x-default": "/about",
    },
  },
  keywords: [
    "about voldigoade",
    "rust",
    "linux",
    "cli tooling",
    "osint",
    "security",
    "open source projects",
    "spoor",
    "crucksware",
  ],
  openGraph: {
    title: "About Voldigoade",
    description:
      "Rust tools, public footprint inspection, and source-linked research.",
    url: `${siteUrl}/en/about`,
    type: "profile",
    locale: "en_US",
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
      "Rust tools, public footprint inspection, and source-linked research.",
    images: [aboutOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const timelineItems: TimelineItem[] = [
  {
    period: "Rust CLI & Tooling",
    title: "Spoor",
    url: "https://github.com/Voldigoade/spoor",
    description:
      "Rust CLI to inspect what a GitHub account or repository exposes publicly: commits, keys, and metadata.",
    highlights: [
      "Distinguishes observed facts from derived values and inference boundaries.",
      "Embedded HTTP service, structured JSON export, and local SQLite cache.",
      "Designed to respect GitHub API rate limits and explicitly document query limits.",
    ],
  },
  {
    period: "Firmware Tooling",
    title: "Crucksware",
    url: "https://github.com/Voldigoade/crucksware",
    description:
      "Rust prototype to compare two extracted Linux firmware rootfs trees and produce clean diff reports.",
    highlights: [
      "Semantic comparison of directory hierarchies and file trees.",
      "Deterministic plain-text and JSON output formats.",
      "Experimental open-source project under active development.",
    ],
  },
  {
    period: "Security Research",
    title: "Messaging Research",
    url: "https://github.com/Voldigoade/recherche-messageries",
    description:
      "Methodical comparison of secure messaging apps evaluated across threat models, metadata exposure, and audits.",
    highlights: [
      "Covers Signal, SimpleX, Session, Olvid, Threema, and Briar.",
      "Examines network traces, central server architecture, and pseudonymity.",
      "Backed by primary sources, security advisories, and public audits.",
    ],
  },
];

export default function EnglishAboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Voldigoade",
    url: `${siteUrl}/en/about`,
    inLanguage: "en",
    mainEntity: {
      "@type": "Person",
      name: "Voldigoade",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutJsonLd) }}
      />
      <AboutPageClient timelineItems={timelineItems} locale="en" />
    </>
  );
}
