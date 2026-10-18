"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlogGrid } from "@/components/portfolio/blog-grid";
import { GithubOverviewBento } from "@/components/portfolio/github-overview-bento";
import { HeroFloatingBadges } from "@/components/portfolio/hero-floating-badges";
import { HomeDeliveryProcess } from "@/components/portfolio/home-delivery-process";
import { HomeEngagementModel } from "@/components/portfolio/home-engagement-model";
import { HyperNameReveal } from "@/components/portfolio/hyper-name-reveal";
import { MorphScrollShowcase } from "@/components/portfolio/morph-scroll-showcase";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { RetroCodeShowcase } from "@/components/portfolio/retro-code-showcase";
import { RetroTerminalSection } from "@/components/portfolio/retro-terminal-section";
import { BentoCard, BentoGrid } from "@/components/retroui/Bento";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Link2 } from "@/components/retroui/icons";

import { links } from "@/lib/link-items";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
} from "@/lib/portfolio-types";
import { githubUrl, linkHubUrl } from "@/lib/site-config";
import { getCopy, type Locale } from "@/lib/site-copy";
import { type HomeFocus, useHomeStore } from "@/store/home-store";

type HomePageClientProps = {
  initialRepos?: GithubRepo[];
  initialPosts?: BlogPost[];
  initialGitHubOverview?: GitHubOverviewPayload | null;
  locale?: Locale;
};

export function HomePageClient({
  initialRepos,
  initialPosts,
  initialGitHubOverview,
  locale,
}: HomePageClientProps) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale);
  const homeCopy = copy.home;
  const isFrench = currentLocale === "fr";

  const githubOverview = initialGitHubOverview ?? null;
  const focus = useHomeStore((state) => state.focus);
  const setFocus = useHomeStore((state) => state.setFocus);

  const focusFilters: readonly HomeFocus[] = isFrench
    ? (["Tous", "Rust & CLI", "OSINT", "Firmware", "Local-First"] as const)
    : (["All", "Rust & CLI", "OSINT", "Firmware", "Local-First"] as const);

  const focusItems = [
    {
      key: isFrench ? "Rust & CLI" : "Rust & CLI",
      title: homeCopy.quickFocus.items[0]?.title ?? "Rust & CLI",
      body: homeCopy.quickFocus.items[0]?.text ?? "",
    },
    {
      key: isFrench ? "OSINT" : "OSINT",
      title: homeCopy.quickFocus.items[1]?.title ?? "OSINT & Footprint",
      body: homeCopy.quickFocus.items[1]?.text ?? "",
    },
    {
      key: isFrench ? "Firmware" : "Firmware",
      title: homeCopy.quickFocus.items[2]?.title ?? "Firmware & Rootfs",
      body: homeCopy.quickFocus.items[2]?.text ?? "",
    },
    {
      key: isFrench ? "Local-First" : "Local-First",
      title: homeCopy.quickFocus.items[3]?.title ?? "Local-First & Privacy",
      body: homeCopy.quickFocus.items[3]?.text ?? "",
    },
  ];

  const visibleFocusItems =
    focus === "Tous" || focus === "All"
      ? focusItems
      : focusItems.filter(
          (item) =>
            item.key === focus ||
            (focus === "Rust & CLI" && item.key.includes("Rust")) ||
            (focus === "OSINT" && item.key.includes("OSINT")) ||
            (focus === "Firmware" && item.key.includes("Firmware")) ||
            (focus === "Local-First" && item.key.includes("Local")),
        );

  const projectsHref = isFrench ? "/project" : "/en/project";
  const blogHref = isFrench ? "/blog" : "/en/blog";

  return (
    <div className="space-y-12 pb-16">
      <HeroFloatingBadges />

      <section className="relative" data-home-reveal>
        <div className="relative border-4 border-black bg-card shadow-retro-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-black bg-muted px-4 py-3">
            <span className="font-pixel text-xs uppercase sm:text-sm">
              {homeCopy.hero.workspace}
            </span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 border-2 border-black bg-[#ff5f56]" />
              <span className="h-3 w-3 border-2 border-black bg-[#ffbd2e]" />
              <span className="h-3 w-3 border-2 border-black bg-[#27c93f]" />
            </div>
          </div>

          <div className="grid gap-4 p-2 sm:gap-6 sm:p-5 md:grid-cols-[1.2fr_0.8fr] md:gap-8 md:p-10">
            <div className="order-2 space-y-4 md:order-1 md:space-y-6">
              <h1 className="font-display uppercase leading-[1.1]">
                <span className="block text-[clamp(0.95rem,6vw,2.5rem)] sm:text-[clamp(1.7rem,5.2vw,3.8rem)]">
                  {homeCopy.hero.greeting}
                </span>
                <span className="mt-1 block text-[clamp(1.05rem,8vw,3rem)] sm:text-[clamp(1.8rem,5.6vw,4.4rem)]">
                  <span className="retro-curve-underline">
                    <HyperNameReveal text="Voldigoade." />
                  </span>
                </span>
              </h1>
              <p className="max-w-2xl border-l-4 border-black pl-3 text-xs font-medium leading-relaxed sm:pl-4 sm:text-sm md:text-lg">
                {homeCopy.hero.tagline}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href={projectsHref}>{homeCopy.hero.projectsCta}</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href={blogHref}>{homeCopy.hero.blogCta}</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-56 border-4 border-black bg-primary p-2 shadow-retro-md sm:max-w-xs sm:p-3 md:order-2 md:max-w-sm">
              <div className="border-4 border-black bg-card p-0">
                <Image
                  src="/images/avatar.png"
                  alt="Emblème Voldigoade"
                  width={384}
                  height={384}
                  loading="eager"
                  priority
                  fetchPriority="high"
                  quality={85}
                  sizes="(max-width: 640px) 224px, (max-width: 768px) 320px, 384px"
                  className="block h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="retro-social-icon"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href={projectsHref}
                  className="retro-social-icon"
                  aria-label={copy.footer.projectsAria}
                >
                  <Link2 className="h-4 w-4" />
                </Link>
                <Link
                  href={blogHref}
                  className="retro-social-icon"
                  aria-label={copy.footer.blogAria}
                >
                  <Link2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {isFrench ? "Aperçu Technique" : "Technical Overview"}
        </h2>
        <BentoGrid>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase sm:text-2xl">
              {isFrench
                ? "Spoor — Empreinte GitHub"
                : "Spoor — GitHub Footprint"}
            </p>
            <p className="mt-2 text-sm font-medium">
              {isFrench
                ? "CLI Rust pour auditer ce qu'un profil ou repo GitHub expose publiquement : commits, clés et métadonnées réelles."
                : "Rust CLI inspecting public GitHub metadata: commit identities, SSH keys, and structured reports."}
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              {isFrench
                ? "Crucksware — Rootfs Diff"
                : "Crucksware — Rootfs Diff"}
            </p>
            <p className="mt-2 text-sm font-medium">
              {isFrench
                ? "Prototype en Rust pour comparer deux rootfs de firmware Linux extraits avec sortie texte et JSON déterministe."
                : "Rust prototype for diffing extracted Linux firmware rootfs trees with deterministic text and JSON output."}
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              {isFrench
                ? "Messageries Sécurisées"
                : "Secure Messaging Research"}
            </p>
            <p className="mt-2 text-sm font-medium">
              {isFrench
                ? "Étude comparative sourcée de Signal, SimpleX, Session, Olvid, Threema et Briar selon les threat models et métadonnées réseau."
                : "Source-linked comparison of Signal, SimpleX, Session, Olvid, Threema and Briar across threat models and metadata exposure."}
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              {isFrench
                ? "Local-First & Transparence"
                : "Local-First & Transparency"}
            </p>
            <p className="mt-2 text-sm font-medium">
              {isFrench
                ? "Priorité au traitement local des données, zéro cookie sur ce site, pas de télémétrie invasive et code sous licence open source."
                : "Focus on local execution, zero cookies on this site, no tracking telemetry, and open-source licensed tools."}
            </p>
          </BentoCard>
        </BentoGrid>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {homeCopy.quickFocus.title}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {homeCopy.quickFocus.items.map((trait) => (
            <Card
              key={trait.title}
              className="w-full border-4 border-black bg-card shadow-retro-md retro-press"
            >
              <Card.Header>
                <Card.Title className="font-display text-2xl uppercase">
                  {trait.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed">{trait.text}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <div data-home-reveal>
        <HomeDeliveryProcess locale={currentLocale} />
      </div>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-wrap items-center gap-2">
          {focusFilters.map((item) => (
            <Button
              key={item}
              variant={focus === item ? "default" : "secondary"}
              onClick={() => setFocus(item)}
              aria-pressed={focus === item}
              className="border-4 border-black shadow-retro-sm uppercase"
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visibleFocusItems.map((item) => (
            <Card
              key={item.key}
              className="border-4 border-black bg-card shadow-retro-md"
            >
              <Card.Header>
                <Card.Title className="font-display text-xl uppercase">
                  {item.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed">{item.body}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <div data-home-reveal>
        <HomeEngagementModel locale={currentLocale} />
      </div>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            {homeCopy.featuredProjects.title}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href={projectsHref}>{homeCopy.featuredProjects.viewAll}</Link>
          </Button>
        </div>
        <ProjectsGrid
          compact
          limit={3}
          initialRepos={initialRepos}
          locale={currentLocale}
        />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            {homeCopy.recentWriting.title}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href={blogHref}>{homeCopy.recentWriting.viewAll}</Link>
          </Button>
        </div>
        <BlogGrid
          compact
          limit={3}
          initialPosts={initialPosts}
          locale={currentLocale}
        />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            {homeCopy.githubOverview.title}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              {homeCopy.githubOverview.profileCta}
            </Link>
          </Button>
        </div>
        <p className="font-bold uppercase text-muted-foreground">
          {homeCopy.githubOverview.subtitle}
        </p>
        <GithubOverviewBento stats={githubOverview ?? null} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {isFrench ? "Axes de Recherche" : "Research Topics"}
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              body: isFrench
                ? "Que révèlent concrètement les métadonnées publiques GitHub, et où s'arrêtent les faits vérifiés face aux déductions ?"
                : "What do public GitHub metadata actually expose in practice, and where do verified facts end and inferences begin?",
              title: isFrench ? "Empreinte Publique" : "Public Footprint",
            },
            {
              body: isFrench
                ? "Quelle application de messagerie répond à un modèle de menace spécifique, et quelles métadonnées demeurent exposées ?"
                : "Which messaging app satisfies a specific threat model, and what network metadata remains exposed?",
              title: isFrench
                ? "Compromis de Messagerie"
                : "Messaging Trade-offs",
            },
            {
              body: isFrench
                ? "Comment diff et trier efficacement des rootfs de firmware Linux sans fausses alertes ni bruit ?"
                : "How to effectively diff and triage extracted Linux firmware rootfs trees with minimal noise?",
              title: isFrench ? "Diff Firmware" : "Firmware Diffing",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="flex h-full w-full flex-col border-4 border-black bg-card shadow-retro-md retro-press"
            >
              <Card.Content className="flex h-full min-h-44 flex-col gap-4">
                <p className="text-lg font-bold leading-relaxed">{item.body}</p>
                <p className="mt-auto text-sm font-black uppercase text-muted-foreground">
                  {item.title}
                </p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {isFrench ? "Explorer & Vérifier" : "Explore & Verify"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                {isFrench ? "Explorer le Code Source" : "Explore Source Code"}
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                {isFrench
                  ? "Parcourez les dépôts publics sur GitHub, inspectez les commits et testez les outils en local."
                  : "Browse public repositories on GitHub, inspect commit histories, and run the tools locally."}
              </p>
              <Button asChild className="w-full sm:w-auto uppercase">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {isFrench ? "Dépôts publics" : "Public Repositories"}
                </Link>
              </Button>
            </Card.Content>
          </Card>

          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                {isFrench ? "Lire les Articles" : "Read Articles"}
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                {isFrench
                  ? "Consultez les notes techniques, write-ups et comparatifs méthodologiques sur le blog."
                  : "Check technical notes, write-ups, and methodological comparisons on the blog."}
              </p>
              <Button
                asChild
                variant="secondary"
                className="w-full sm:w-auto uppercase"
              >
                <Link href={blogHref}>
                  {isFrench ? "Consulter le blog" : "Browse blog"}
                </Link>
              </Button>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            {isFrench ? "Ressources & Liens" : "Resources & Links"}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={linkHubUrl} target="_blank" rel="noreferrer noopener">
              GitHub
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.slice(0, 9).map((item) => (
            <Card
              key={item.href}
              className="flex h-full w-full flex-col border-4 border-black bg-card shadow-retro-md retro-press"
            >
              <Card.Header className="min-h-36 flex-1">
                <Card.Title className="font-display text-xl uppercase">
                  {item.name}
                </Card.Title>
                <Card.Description className="mt-2 text-base leading-relaxed">
                  {item.description}
                </Card.Description>
              </Card.Header>
              <Card.Content className="pt-0">
                <Button
                  asChild
                  className="w-full border-4 border-black shadow-retro-sm uppercase"
                >
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {isFrench ? "Ouvrir le lien" : "Open link"}
                  </Link>
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="border-4 border-black bg-primary p-6 shadow-retro-lg sm:p-8 md:p-10"
        data-home-reveal
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <h2 className="font-display text-3xl uppercase text-primary-foreground sm:text-4xl md:text-5xl">
              {isFrench ? "Projets & Publications" : "Projects & Publications"}
            </h2>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-primary-foreground/90 sm:text-base">
              {isFrench
                ? "Une question technique ou une suggestion sur un projet public ? Consultez les dépôts correspondants sur GitHub ou découvrez les articles sur le blog."
                : "Have a technical question or suggestion on a public repo? Check out the repositories on GitHub or read write-ups on the blog."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full border-4 border-black bg-card text-card-foreground px-6 py-3 font-black uppercase shadow-retro retro-press sm:w-auto"
            >
              <Link href={blogHref}>
                {isFrench ? "Voir le blog" : "View blog"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full border-4 border-black px-6 py-3 font-black uppercase shadow-retro retro-press sm:w-auto"
            >
              <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {homeCopy.faq.title}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {homeCopy.faq.items.map((item) => (
            <Card
              key={item.question}
              className="flex h-full w-full flex-col border-4 border-black bg-card shadow-retro-md retro-press"
            >
              <Card.Header>
                <Card.Title className="font-display text-xl uppercase">
                  {item.question}
                </Card.Title>
              </Card.Header>
              <Card.Content className="flex flex-1 flex-col gap-3">
                <p className="font-medium leading-relaxed">{item.answer}</p>
                {item.ctaHref && item.ctaLabel ? (
                  <Button
                    asChild
                    className="mt-auto w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
                  >
                    <Link href={item.ctaHref}>{item.ctaLabel}</Link>
                  </Button>
                ) : null}
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <div data-home-reveal>
        <MorphScrollShowcase locale={currentLocale} />
      </div>

      <div data-home-reveal>
        <RetroCodeShowcase locale={currentLocale} />
      </div>

      <div data-home-reveal>
        <RetroTerminalSection locale={currentLocale} />
      </div>
    </div>
  );
}
