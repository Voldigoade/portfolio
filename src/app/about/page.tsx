import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/about-page-client";
import type { TimelineItem } from "@/components/portfolio/about-timeline";
import { siteUrl } from "@/lib/site-config";

const aboutOgImageUrl = `${siteUrl}/about/opengraph-image`;

export const metadata: Metadata = {
  title: "About",
  description: "The background, technical focus, and milestones of Voldigoade.",
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "about voldigoade",
    "systems engineering",
    "rust",
    "security research",
    "open source maintainer",
    "spoor",
  ],
  openGraph: {
    title: "About Voldigoade",
    description:
      "Background, technical focus, and open-source milestones across systems, security, and developer tooling.",
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
      "Background, technical focus, and open-source milestones across systems, security, and developer tooling.",
    images: [aboutOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatPeriod(start: string, end: string): string {
  const startDate = new Date(`${start} 01`);
  const endDate =
    end.toLowerCase() === "present"
      ? new Date("2026-05-01")
      : new Date(`${end} 01`);

  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months += endDate.getMonth() - startDate.getMonth();
  months += 1;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let durationObj = "";
  if (years > 0) {
    durationObj += `${years} yr${years > 1 ? "s" : ""}`;
  }
  if (remainingMonths > 0) {
    if (durationObj) durationObj += " ";
    durationObj += `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`;
  }
  if (!durationObj) {
    durationObj = "1 mo";
  }

  return `${start} - ${end} · ${durationObj}`;
}

const timelineItems: TimelineItem[] = [
  {
    period: formatPeriod("Sep 2025", "Present"),
    title: "Lead Maintainer & Author (Spoor · Open Source)",
    url: "https://github.com/Voldigoade/spoor",
    description:
      "Architected and actively maintain Spoor, an open-source footprint scanner that audits developer exposure, public GitHub activity streams, and commit metadata.",
    highlights: [
      "Designed modular CLI architecture in Rust for deterministic scanning and zero-telemetry execution.",
      "Implemented heuristics to detect unintended token leakage and commit author exposure.",
      "Shipped Spoor v0.1.4 release with comprehensive unit testing and multi-platform binary builds.",
    ],
  },
  {
    period: formatPeriod("Jan 2025", "Present"),
    title: "Security & Privacy Researcher (Recherche Messageries · Research)",
    url: "https://github.com/Voldigoade/recherche-messageries",
    description:
      "Conducting comparative audits and threat modeling of encrypted messaging architectures, metadata resistance, and peer-to-peer routing protocols.",
    highlights: [
      "Evaluated Signal Protocol, Matrix Olm/Megolm, Simplex Chat, and Briar transport layers.",
      "Published comparative matrices covering forward secrecy, metadata resistance, and trust models.",
      "Created open benchmark suites and reproducibility scripts for protocol verification.",
    ],
  },
  {
    period: formatPeriod("Jun 2024", "Jan 2025"),
    title: "Developer Tooling & Environments (IDE Research · Open Source)",
    url: "https://github.com/Voldigoade/ide-research",
    description:
      "Researched modern cloud and containerized development architectures, sandboxing techniques, and local-first developer workflows.",
    highlights: [
      "Analyzed security boundaries of remote containerized IDE environments.",
      "Documented trade-offs between local developer control and cloud workspace orchestration.",
      "Prototyped lightweight developer workflows emphasizing security and minimal external dependencies.",
    ],
  },
  {
    period: formatPeriod("Jan 2024", "May 2024"),
    title: "Low-Level Systems Exploration (Diskboot & Crukst · Open Source)",
    url: "https://github.com/Voldigoade/diskboot",
    description:
      "Explored minimal system initialization, Linux storage abstractions, and low-level boot procedures.",
    highlights: [
      "Investigated low-level disk formatting, boot stages, and partition inspection.",
      "Focused on deterministic, reproducible setups with minimal toolchains.",
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
      jobTitle: "Software Engineer & Systems Researcher",
    },
  };

  return (
    <>
      <script type="application/ld+json">{serializeJsonLd(aboutJsonLd)}</script>
      <AboutPageClient timelineItems={timelineItems} />
    </>
  );
}
