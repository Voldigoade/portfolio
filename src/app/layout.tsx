import type { Metadata, Viewport } from "next";
import { Bungee, Press_Start_2P, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AnimePageAnimator } from "@/components/layout/anime-page-animator";
import { CloudflareAnalytics } from "@/components/layout/cloudflare-analytics";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RouteProgressBar } from "@/components/layout/route-progress-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { githubUrl, ogImageUrl, siteUrl } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-bungee",
  weight: "400",
  subsets: ["latin"],
});

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

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto'||stored==='system')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(mode==='auto'||mode==='system')?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'||mode==='system'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfToken = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Voldigoade",
    url: siteUrl,
    sameAs: [githubUrl],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Voldigoade",
    url: siteUrl,
    inLanguage: "fr",
    publisher: {
      "@type": "Person",
      name: "Voldigoade",
      url: siteUrl,
    },
    sameAs: [githubUrl],
  };

  const shellFallback = (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6">
        <p className="font-pixel text-2xl uppercase text-foreground sm:text-3xl">
          Voldigoade
        </p>
        <p className="mt-2 text-sm font-black uppercase text-muted-foreground sm:text-base">
          Chargement de l&apos;espace de travail
          <span className="animate-dots" />
        </p>
        <div className="mt-5 h-7 border-4 border-black bg-muted p-1 sm:h-8">
          <div className="h-full w-full animate-pulse border-2 border-black bg-primary" />
        </div>
      </div>
    </div>
  );

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link
          rel="preconnect"
          href="https://avatars.githubusercontent.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${bungee.variable} ${pressStart.variable} antialiased`}
      >
        {cfToken ? <CloudflareAnalytics token={cfToken} /> : null}
        <Suspense fallback={shellFallback}>
          <ThemeProvider>
            <RouteProgressBar />
            <AnimePageAnimator />
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
              <Navbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 sm:pt-28">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
