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
  },
  keywords: [
    "à propos de voldigoade",
    "ingénierie systèmes",
    "rust",
    "recherche sécurité",
    "projets open source",
    "spoor",
  ],
  openGraph: {
    title: "À propos de Voldigoade",
    description:
      "Outils d'inspection en Rust, modélisation de menaces et recherches comparatives documentées.",
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
      "Outils d'inspection en Rust, modélisation de menaces et recherches comparatives documentées.",
    images: [aboutOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const timelineItems: TimelineItem[] = [
  {
    period: "Outillage Rust",
    title: "Spoor",
    url: "https://github.com/Voldigoade/spoor",
    description:
      "Outil en ligne de commande pour inspecter les profils publics GitHub, les dépôts, les identités de commit et les clés publiques.",
    highlights: [
      "Les rapports distinguent formellement les données observées, valeurs calculées et inférences.",
      "Export de rapports structurés et service de consultation HTTP documentés dans le dépôt.",
      "Limites d'analyse explicitées : bornes d'analyse, fraîcheur du cache et quotas de l'API.",
    ],
  },
  {
    period: "Recherche messageries",
    title: "Recherche Messageries",
    url: "https://github.com/Voldigoade/recherche-messageries",
    description:
      "Comparaison méthodique des protocoles de communication sécurisée : chiffrement du contenu, métadonnées, pseudonymat, exposition réseau et modèles de menaces.",
    highlights: [
      "Traçabilité documentaire : audits publics, avis de sécurité et spécifications officielles.",
      "Recommandations conditionnées selon la plateforme, la configuration et le profil d'adversaire.",
      "Périmètre transparent : l'étude documente ses propres limites et ne constitue pas une certification.",
    ],
  },
  {
    period: "Environnements développeur",
    title: "IDE Research",
    url: "https://github.com/Voldigoade/ide-research",
    description:
      "Étude comparative des environnements de développement intégrés : flux distants, intégration d'agents IA, sécurité, vie privée et licences.",
    highlights: [
      "Méthode d'évaluation, registre de preuves, sélecteur guidé et matrice de comparaison.",
      "Évaluations conditionnelles basées sur des critères déclarés, distinctes de simples benchmarks.",
      "Licences séparées pour les données de recherche et le code des outils.",
    ],
  },
  {
    period: "Fondation expérimentale",
    title: "Crukst",
    url: "https://github.com/Voldigoade/crukst",
    description:
      "Ébauche d'architecture et fondation Rust pour la comparaison sémantique et le tri de firmwares.",
    highlights: [
      "Moteur de comparaison de firmwares et systèmes de fichiers encore en phase exploratoire.",
      "Le README distingue strictement les fonctionnalités planifiées de l'état actuel du code.",
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
      <AboutPageClient timelineItems={timelineItems} />
    </>
  );
}
