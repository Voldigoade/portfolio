import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/about-page-client";
import type { TimelineItem } from "@/components/portfolio/about-timeline";
import { siteUrl } from "@/lib/site-config";

const aboutOgImageUrl = `${siteUrl}/about/opengraph-image`;

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Projets publics, démarche technique et axes de recherche de Voldigoade.",
  alternates: {
    canonical: "/about",
    languages: {
      fr: "/about",
      en: "/en/about",
      "x-default": "/about",
    },
  },
  keywords: [
    "à propos de voldigoade",
    "rust",
    "linux",
    "outillage cli",
    "osint",
    "sécurité",
    "projets open source",
    "spoor",
    "crucksware",
  ],
  openGraph: {
    title: "À propos de Voldigoade",
    description:
      "Outils en Rust, inspection d'empreinte publique et comparatifs sourcés.",
    url: `${siteUrl}/about`,
    type: "profile",
    locale: "fr_FR",
    images: [
      {
        url: aboutOgImageUrl,
        width: 1200,
        height: 630,
        alt: "À propos de Voldigoade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos de Voldigoade",
    description:
      "Outils en Rust, inspection d'empreinte publique et comparatifs sourcés.",
    images: [aboutOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const timelineItems: TimelineItem[] = [
  {
    period: "CLI & Tooling Rust",
    title: "Spoor",
    url: "https://github.com/Voldigoade/spoor",
    description:
      "CLI Rust pour auditer ce qu'un compte ou un repo GitHub expose publiquement : identités de commit, clés et métadonnées.",
    highlights: [
      "Distingue données observées, valeurs dérivées et limites d'inférence.",
      "Service HTTP, exports JSON structurés et cache SQLite local.",
      "Conçu pour respecter les quotas de l'API GitHub et documenter ses bornes.",
    ],
  },
  {
    period: "Firmware Tooling",
    title: "Crucksware",
    url: "https://github.com/Voldigoade/crucksware",
    description:
      "Prototype en Rust pour comparer deux rootfs de firmware Linux extraits et générer un rapport de diff.",
    highlights: [
      "Diff sémantique de dossiers et d'arbres de fichiers.",
      "Sortie déterministe en texte et JSON.",
      "Projet expérimental sous licence open source, en cours de développement.",
    ],
  },
  {
    period: "Recherche Sécurité",
    title: "Recherche Messageries",
    url: "https://github.com/Voldigoade/recherche-messageries",
    description:
      "Comparatif méthodique d'applications de messagerie chiffrée selon les threat models, l'exposition des métadonnées et les audits.",
    highlights: [
      "Analyse de Signal, SimpleX, Session, Olvid, Threema et Briar.",
      "Examen des flux réseau, des serveurs centraux et de l'anonymat.",
      "Références primaires, avis de sécurité et audits publics vérifiables.",
    ],
  },
];

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "À propos de Voldigoade",
    url: `${siteUrl}/about`,
    inLanguage: "fr",
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
      <AboutPageClient timelineItems={timelineItems} locale="fr" />
    </>
  );
}
