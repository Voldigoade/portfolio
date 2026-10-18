"use client";

import Image from "next/image";
import Link from "next/link";
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
import { useHomeStore } from "@/store/home-store";

const traits = [
  {
    title: "Systèmes & Sécurité",
    text: "Comprendre le comportement intime des logiciels, ce qu'ils exposent, et expliciter leurs hypothèses sous-jacentes.",
  },
  {
    title: "Rust & Outillage CLI",
    text: "Concevoir des outils rapides et résilients en ligne de commande en apprenant de leur implémentation et de leurs limites.",
  },
  {
    title: "Local-First & Confidentialité",
    text: "Privilégier le contrôle local, évaluer les compromis d'exposition et minimiser la dépendance aux services tiers.",
  },
  {
    title: "Ingénierie Open Source",
    text: "Partager le code et des comparatifs sourcés pour permettre à chacun de vérifier les preuves et le périmètre d'action.",
  },
];

const focusFilters = [
  "Tous",
  "Systèmes",
  "Sécurité",
  "Open Source",
  "Outillage",
] as const;

type FaqItem = {
  question: string;
  answer: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const faqItems: readonly FaqItem[] = [
  {
    question: "Sur quoi travaillez-vous ?",
    answer:
      "Je développe des outils d'inspection en Rust et mène des recherches comparatives sur les messageries sécurisées et les environnements de travail. Les dépôts publics présentent le périmètre et les limites réelles de chaque projet.",
  },
  {
    question: "Qu'est-ce que Spoor ?",
    answer:
      "Spoor est un outil en ligne de commande permettant d'auditer les profils publics GitHub, les dépôts, les identités de commit et les clés de signature. Ses rapports distinguent données observées, valeurs dérivées et inférences.",
    ctaHref: "https://github.com/Voldigoade/spoor",
    ctaLabel: "Voir Spoor",
  },
  {
    question: "Quelles technologies composent vos projets ?",
    answer:
      "Spoor est écrit en Rust avec cache SQLite. Les travaux de recherche exploitent Python et l'outillage web moderne. Ce portfolio utilise Next.js, React et TypeScript.",
  },
  {
    question: "Vos projets sont-ils open source ?",
    answer:
      "Les projets présentés disposent de dépôts publics vérifiables. Consultez la licence de chaque dépôt sur GitHub : code, données et documentation font l'objet de termes explicites.",
    ctaHref: githubUrl,
    ctaLabel: "Profil GitHub",
  },
  {
    question: "Comment poser une question technique ou contribuer ?",
    answer:
      "Pour toute question technique, suggestion ou signalement, ouvrez une issue ou une discussion directement sur le dépôt GitHub correspondant.",
    ctaHref: "/project",
    ctaLabel: "Explorer les projets",
  },
  {
    question: "Publiez-vous des analyses techniques ?",
    answer:
      "La section Blog regroupe des articles approfondis, des retours d'expérience d'ingénierie et des notes de recherche accessibles en français et en anglais.",
    ctaHref: "/blog",
    ctaLabel: "Lire le blog",
  },
] as const;

type HomePageClientProps = {
  initialRepos?: GithubRepo[];
  initialPosts?: BlogPost[];
  initialGitHubOverview?: GitHubOverviewPayload | null;
};

export function HomePageClient({
  initialRepos,
  initialPosts,
  initialGitHubOverview,
}: HomePageClientProps) {
  const githubOverview = initialGitHubOverview ?? null;
  const focus = useHomeStore((state) => state.focus);
  const setFocus = useHomeStore((state) => state.setFocus);

  const focusItems = [
    {
      key: "Systèmes",
      title: "Systèmes & Infrastructure",
      body: "Développement d'outils CLI performants en Rust, incluant Spoor et la fondation expérimentale du projet Crukst.",
    },
    {
      key: "Sécurité",
      title: "Sécurité & Analyse de Menaces",
      body: "Comparaison rigoureuse des messageries chiffrées selon les modèles de menaces, l'exposition des métadonnées et les limites documentées.",
    },
    {
      key: "Open Source",
      title: "Recherche Ouverte & Vérifiable",
      body: "Documentation publique avec références primaires, registres de preuves et critères d'évaluation transparents.",
    },
    {
      key: "Outillage",
      title: "Environnements Développeur",
      body: "Étude critique des flux d'ingénierie : intégration d'agents, télémétrie, contraintes de licence et contrôle local.",
    },
  ];

  const visibleFocusItems =
    focus === "Tous" || focus === "All"
      ? focusItems
      : focusItems.filter(
          (item) =>
            item.key === focus ||
            (focus === "Systems" && item.key === "Systèmes") ||
            (focus === "Security" && item.key === "Sécurité") ||
            (focus === "Tooling" && item.key === "Outillage"),
        );

  return (
    <div className="space-y-12 pb-16">
      <HeroFloatingBadges />

      <section className="relative" data-home-reveal>
        <div className="relative border-4 border-black bg-card shadow-retro-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-black bg-muted px-4 py-3">
            <span className="font-pixel text-xs uppercase sm:text-sm">
              workspace://voldigoade
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
                  BONJOUR, JE SUIS
                </span>
                <span className="mt-1 block text-[clamp(1.05rem,8vw,3rem)] sm:text-[clamp(1.8rem,5.6vw,4.4rem)]">
                  <span className="retro-curve-underline">
                    <HyperNameReveal text="Voldigoade." />
                  </span>
                </span>
              </h1>
              <p className="max-w-2xl border-l-4 border-black pl-3 text-xs font-medium leading-relaxed sm:pl-4 sm:text-sm md:text-lg">
                Ingénierie logicielle et recherche appliquée sur les systèmes,
                la sécurité, la confidentialité numérique et les outils pour
                développeurs.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href="/project">Voir les projets</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href="/blog">Voir le blog</Link>
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
                  aria-label="Profil GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="/project"
                  className="retro-social-icon"
                  aria-label="Explorer les projets"
                >
                  <Link2 className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="retro-social-icon"
                  aria-label="Lire le blog"
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
          Centre de contrôle
        </h2>
        <BentoGrid>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase sm:text-2xl">
              Projets Rust & Systèmes
            </p>
            <p className="mt-2 text-sm font-medium">
              Spoor inspecte les profils publics GitHub, dépôts, identités de
              commit et clés de signature. Les rapports séparent rigoureusement
              faits observés et inférences.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Confidentialité & Contrôle Local
            </p>
            <p className="mt-2 text-sm font-medium">
              Analyse de l&apos;impact des choix d&apos;architecture sur
              l&apos;exposition des métadonnées, la dépendance aux plateformes
              cloud et le contrôle des données en local.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Environnements de Développement
            </p>
            <p className="mt-2 text-sm font-medium">
              IDE Research compare les outils de développement sur plusieurs
              dimensions : flux distants, agents IA, souveraineté des données et
              licences logicielles.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Publications & Recherche
            </p>
            <p className="mt-2 text-sm font-medium">
              Articles techniques originaux et documentation structurée publiés
              avec traçabilité des sources.
            </p>
          </BentoCard>
        </BentoGrid>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Principes Clés
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {traits.map((trait) => (
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
        <HomeDeliveryProcess />
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <HomeEngagementModel />
      </div>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Projets en vedette
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href="/project">Voir tous les projets</Link>
          </Button>
        </div>
        <ProjectsGrid compact limit={3} initialRepos={initialRepos} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Dernières publications
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href="/blog">Voir tout le blog</Link>
          </Button>
        </div>
        <BlogGrid compact limit={3} initialPosts={initialPosts} locale="fr" />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Statistiques GitHub
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              Voir le profil GitHub
            </Link>
          </Button>
        </div>
        <p className="font-bold uppercase text-muted-foreground">
          Abonnés, abonnements, étoiles, forks, dépôts et activités publiques
          sur GitHub.
        </p>
        <GithubOverviewBento stats={githubOverview ?? null} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Questions de recherche
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              body: "Que révèlent concrètement les métadonnées publiques GitHub, et où s'arrêtent les faits vérifiés face aux déductions ?",
              title: "Empreinte Publique",
            },
            {
              body: "Quelle application de messagerie répond à un modèle de menace spécifique, et quelles métadonnées demeurent exposées ?",
              title: "Compromis de Messagerie",
            },
            {
              body: "Comment les environnements de développement se distinguent-ils sur le travail distant, l'outillage IA et la vie privée ?",
              title: "Flux de Travail Développeur",
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
          Explorer & Vérifier
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Explorer le Code Source
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                Parcourez les dépôts publics, consultez leur documentation
                technique et examinez les implémentations effectives.
              </p>
              <Button asChild className="w-full sm:w-auto uppercase">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Voir les dépôts publics
                </Link>
              </Button>
            </Card.Content>
          </Card>

          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Lire les Recherches
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                Consultez les articles techniques, comparatifs méthodologiques
                et analyses d&apos;architecture sur le blog.
              </p>
              <Button
                asChild
                variant="secondary"
                className="w-full sm:w-auto uppercase"
              >
                <Link href="/blog">Consulter le blog</Link>
              </Button>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Ressources & Liens
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={linkHubUrl} target="_blank" rel="noreferrer noopener">
              Profil GitHub
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
                    Ouvrir le lien
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
              Projets & Publications
            </h2>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-primary-foreground/90 sm:text-base">
              Une question technique ou une suggestion sur un projet public ?
              Consultez les dépôts correspondants sur GitHub ou découvrez les
              articles sur le blog.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full border-4 border-black bg-card text-card-foreground px-6 py-3 font-black uppercase shadow-retro retro-press sm:w-auto"
            >
              <Link href="/blog">Voir le blog</Link>
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
        <h2 className="font-display text-3xl uppercase sm:text-4xl">FAQ</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
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
        <MorphScrollShowcase />
      </div>

      <div data-home-reveal>
        <RetroCodeShowcase />
      </div>

      <div data-home-reveal>
        <RetroTerminalSection />
      </div>
    </div>
  );
}
