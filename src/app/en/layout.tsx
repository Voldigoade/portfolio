import type { Metadata, Viewport } from "next";
import { RootShell } from "@/components/layout/root-shell";
import { ogImageUrl, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Voldigoade Portfolio",
  title: {
    default: "Voldigoade | Systems, Software, Security & Privacy",
    template: "%s | Voldigoade",
  },
  description:
    "Open-source software projects and documented technical research on systems, security, privacy and developer tooling by Voldigoade.",
  alternates: {
    canonical: "/en",
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
    "Systems",
    "Security",
    "Privacy",
    "Open Source",
    "Developer Tools",
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
    title: "Voldigoade | Systems, Software, Security & Privacy",
    description:
      "Open-source software projects and documented technical research on systems, security, privacy and developer tooling.",
    url: `${siteUrl}/en`,
    siteName: "Voldigoade",
    type: "website",
    locale: "en_US",
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
    description: "Systems, security and digital privacy.",
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

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell locale="en">{children}</RootShell>;
}
