import type { Metadata, Viewport } from "next";
import { RootShell } from "@/components/layout/root-shell";
import { ogImageUrl, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Voldigoade Portfolio",
  title: {
    default: "Voldigoade | Systèmes, Logiciels, Sécurité & Confidentialité",
    template: "%s | Voldigoade",
  },
  description:
    "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et l'outillage développeur par Voldigoade.",
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  keywords: [
    "Voldigoade",
    "voldigoade.xyz",
    "Rust",
    "Linux",
    "Systèmes",
    "Sécurité",
    "Confidentialité",
    "Open Source",
    "Outils développeur",
  ],
  creator: "Voldigoade",
  publisher: "Voldigoade",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Voldigoade | Systèmes, Logiciels, Sécurité & Confidentialité",
    description:
      "Projets logiciels open-source et recherches documentées sur les systèmes, la sécurité, la confidentialité et l'outillage développeur.",
    url: siteUrl,
    siteName: "Voldigoade",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Voldigoade Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voldigoade",
    description: "Systèmes, sécurité et confidentialité numérique.",
    images: [ogImageUrl],
  },
};

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ff7a00" },
      { media: "(prefers-color-scheme: dark)", color: "#ff9d00" },
    ],
    colorScheme: "light dark",
  };
}

export default function FrRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell locale="fr">{children}</RootShell>;
}
