import { Bungee, Press_Start_2P, Space_Grotesk } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "@/app/globals.css";
import { AnimePageAnimator } from "@/components/layout/anime-page-animator";
import { CloudflareAnalytics } from "@/components/layout/cloudflare-analytics";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RouteProgressBar } from "@/components/layout/route-progress-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { githubUrl, siteUrl } from "@/lib/site-config";
import type { Locale } from "@/lib/site-copy";

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

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto'||stored==='system')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(mode==='auto'||mode==='system')?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'||mode==='system'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
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
    url: locale === "en" ? `${siteUrl}/en` : siteUrl,
    inLanguage: locale,
    publisher: {
      "@type": "Person",
      name: "Voldigoade",
      url: siteUrl,
    },
    sameAs: [githubUrl],
  };

  const fallbackText =
    locale === "en" ? "Loading workspace" : "Chargement de l'espace de travail";

  const shellFallback = (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg border-4 border-black bg-card p-4 shadow-retro-lg sm:p-6">
        <p className="font-pixel text-2xl uppercase text-foreground sm:text-3xl">
          Voldigoade
        </p>
        <p className="mt-2 text-sm font-black uppercase text-muted-foreground sm:text-base">
          {fallbackText}
          <span className="animate-dots" />
        </p>
        <div className="mt-5 h-7 border-4 border-black bg-muted p-1 sm:h-8">
          <div className="h-full w-full animate-pulse border-2 border-black bg-primary" />
        </div>
      </div>
    </div>
  );

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* biome-ignore lint/style/noHeadElement: Next.js App Router root layout head */}
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
              <Navbar locale={locale} />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 sm:pt-28">
                {children}
              </main>
              <Footer locale={locale} />
            </div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
