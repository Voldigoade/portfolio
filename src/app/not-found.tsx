import type { Metadata } from "next";
import Link from "next/link";
import { RootShell } from "@/components/layout/root-shell";
import { SystemStatusPanel } from "@/components/pages/system-status-panel";
import { Button } from "@/components/retroui/Button";
import { siteUrl } from "@/lib/site-config";

const notFoundOgImageUrl = `${siteUrl}/404/opengraph-image`;

export const metadata: Metadata = {
  title: "404 | Page Introuvable",
  description:
    "La page demandée n'existe pas. Continuez votre navigation sur le portfolio de Voldigoade.",
  alternates: {
    canonical: "/404",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "404 | Page Introuvable - Voldigoade",
    description:
      "La page demandée n'est pas disponible. Utilisez la navigation pour continuer.",
    url: `${siteUrl}/404`,
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: notFoundOgImageUrl,
        width: 1200,
        height: 630,
        alt: "Page 404 Portfolio Voldigoade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "404 | Voldigoade",
    description:
      "La page demandée n'est pas disponible. Utilisez la navigation pour continuer.",
    images: [notFoundOgImageUrl],
  },
};

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default function NotFoundPage() {
  const notFoundJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "404 Page Introuvable",
    url: `${siteUrl}/404`,
    inLanguage: "fr",
    isPartOf: {
      "@type": "WebSite",
      name: "Portfolio Voldigoade",
      url: siteUrl,
    },
    description: "Page d'erreur 404 du portfolio Voldigoade.",
  };

  return (
    <RootShell locale="fr">
      <div className="space-y-6 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(notFoundJsonLd) }}
        />

        <section className="relative overflow-hidden border-4 border-black bg-card p-5 shadow-retro-lg sm:p-7 md:p-9">
          <div
            aria-hidden
            className="retro-stripes pointer-events-none absolute inset-0 opacity-20"
          />
          <div className="relative z-10 space-y-3">
            <p className="inline-flex border-2 border-black bg-primary px-3 py-1 font-pixel text-xs uppercase text-primary-foreground sm:text-sm">
              Erreur 404
            </p>
            <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl md:text-6xl">
              Page Introuvable
            </h1>
            <p className="max-w-3xl text-sm font-semibold leading-relaxed sm:text-base">
              Cette ressource n&apos;existe pas ou a été déplacée. Utilisez les
              commandes de navigation ci-dessous pour revenir aux sections
              actives.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="border-4 border-black uppercase">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="border-4 border-black uppercase"
              >
                <Link href="/project">Voir les projets</Link>
              </Button>
            </div>
          </div>
        </section>

        <SystemStatusPanel mode="not-found" />
      </div>
    </RootShell>
  );
}
