"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogGrid } from "@/components/portfolio/blog-grid";
import { GithubOverviewBento } from "@/components/portfolio/github-overview-bento";
import { HackatimeBento } from "@/components/portfolio/hackatime-bento";
import { HeroFloatingBadges } from "@/components/portfolio/hero-floating-badges";
import { HomeDeliveryProcess } from "@/components/portfolio/home-delivery-process";
import { HomeEngagementModel } from "@/components/portfolio/home-engagement-model";
import { HyperNameReveal } from "@/components/portfolio/hyper-name-reveal";
import { MorphScrollShowcase } from "@/components/portfolio/morph-scroll-showcase";
import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import { RetroCodeShowcase } from "@/components/portfolio/retro-code-showcase";
import { RetroTerminalSection } from "@/components/portfolio/retro-terminal-section";
import { StatsMarquee } from "@/components/portfolio/stats-marquee";
import { BentoCard, BentoGrid } from "@/components/retroui/Bento";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Link2, Mail } from "@/components/retroui/icons";

import { links } from "@/lib/link-items";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  HackatimePayload,
} from "@/lib/portfolio-types";
import { githubUrl, linkHubUrl, siteHost } from "@/lib/site-config";
import { useHomeStore } from "@/store/home-store";

const traits = [
  {
    title: "Systems & Security Questions",
    text: "Exploring how software behaves, what it exposes, and where its assumptions need to be made explicit.",
  },
  {
    title: "Rust & Systems Tooling",
    text: "Building terminal-first tools in Rust and learning from their implementation, tests, and limitations.",
  },
  {
    title: "Local-First & Privacy",
    text: "Interested in local control, privacy trade-offs, and understanding which external services software depends on.",
  },
  {
    title: "Open Source Engineering",
    text: "Sharing code and source-linked comparisons so readers can inspect the evidence and project scope.",
  },
];

const focusFilters = [
  "All",
  "Systems",
  "Security",
  "Open Source",
  "Tooling",
] as const;

type FaqItem = {
  question: string;
  answer: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const faqItems: readonly FaqItem[] = [
  {
    question: "What are you working on?",
    answer:
      "I am building Rust tools and researching secure messaging and development environments. The public repositories show each project’s current scope and limitations.",
  },
  {
    question: "What is Spoor?",
    answer:
      "Spoor is a terminal-first tool for inspecting public GitHub profiles, repositories, commit identities, and keys. Its reports distinguish observed data, derived values, and inferences.",
    ctaHref: "https://github.com/Voldigoade/spoor",
    ctaLabel: "View Spoor",
  },
  {
    question: "What technologies appear in the projects?",
    answer:
      "Spoor uses Rust and a SQLite cache. The research sites use Python and web tooling. This portfolio uses Next.js, React, and TypeScript.",
  },
  {
    question: "Are your projects open source?",
    answer:
      "The projects linked here have public repositories. Check each repository’s license: research text, data, and code can have different terms.",
    ctaHref: githubUrl,
    ctaLabel: "GitHub Profile",
  },
  {
    question: "How can I get in touch?",
    answer:
      "Use the contact page for a message, or the relevant GitHub repository for public project questions and feedback.",
    ctaHref: "/contact",
    ctaLabel: "Contact Page",
  },
  {
    question: "Do you publish technical write-ups?",
    answer:
      "The Writing section is available for future articles and notes. For now, the linked research repositories contain the public documentation.",
    ctaHref: "/blog",
    ctaLabel: "View Writing",
  },
] as const;

type HomePageClientProps = {
  initialRepos?: GithubRepo[];
  initialPosts?: BlogPost[];
  initialHackatime?: HackatimePayload | null;
  initialGitHubOverview?: GitHubOverviewPayload | null;
};

export function HomePageClient({
  initialRepos,
  initialPosts,
  initialHackatime,
  initialGitHubOverview,
}: HomePageClientProps) {
  const hackatime = initialHackatime ?? null;
  const githubOverview = initialGitHubOverview ?? null;
  const codingStatsProvider =
    process.env.NEXT_PUBLIC_CODING_STATS_PROVIDER === "hackatime"
      ? "Hackatime"
      : "WakaTime";
  const codingStatsProfileUrl =
    process.env.NEXT_PUBLIC_CODING_STATS_PROFILE_URL;
  const focus = useHomeStore((state) => state.focus);
  const setFocus = useHomeStore((state) => state.setFocus);

  const focusItems = [
    {
      key: "Systems",
      title: "Systems & Infrastructure",
      body: "Working on Rust command-line tools, including Spoor and the experimental Crukst project foundation.",
    },
    {
      key: "Security",
      title: "Security & Threat Research",
      body: "Comparing messaging systems through public sources, threat models, metadata exposure, and documented limitations.",
    },
    {
      key: "Open Source",
      title: "Open Source & Reproducibility",
      body: "Sharing public code and source-linked research. Each repository documents its own scope, evidence, and licensing.",
    },
    {
      key: "Tooling",
      title: "Developer & CLI Tooling",
      body: "Exploring terminal interfaces and comparing development environments, remote workflows, privacy, and licensing.",
    },
  ] as const;

  const visibleFocusItems =
    focus === "All"
      ? focusItems
      : focusItems.filter((item) => item.key === focus);

  return (
    <div className="-mt-3 space-y-8 pb-16 sm:mt-0 sm:space-y-14">
      <StatsMarquee />

      <section
        className="relative overflow-visible border-4 border-black bg-card shadow-retro-lg"
        data-home-reveal
      >
        <div
          aria-hidden
          className="retro-stripes pointer-events-none absolute inset-0 opacity-20"
        />
        <div className="hidden sm:block">
          <HeroFloatingBadges />
        </div>

        <div className="relative z-10 overflow-hidden border-4 border-black bg-card">
          <div className="flex items-center justify-between border-b-4 border-black bg-[#d7d7d7] px-2 py-2 text-black sm:px-3 dark:bg-[#2f2f2f] dark:text-white">
            <p className="font-pixel text-[11px] font-black sm:text-xs">
              {siteHost}
            </p>
            <div className="flex gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center border-2 border-black bg-[#ffd146] text-[#5c3d00] font-black text-[10px] shadow-retro-sm sm:h-6 sm:w-6 sm:text-xs">
                -
              </span>
              <span className="inline-flex h-5 w-5 items-center justify-center border-2 border-black bg-[#52d46b] text-[#0d4f1a] font-black text-[10px] shadow-retro-sm sm:h-6 sm:w-6 sm:text-xs">
                +
              </span>
              <span className="inline-flex h-5 w-5 items-center justify-center border-2 border-black bg-[#ff6e6e] text-[#6b1010] font-black text-[10px] shadow-retro-sm sm:h-6 sm:w-6 sm:text-xs">
                x
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-2 sm:gap-6 sm:p-5 md:grid-cols-[1.2fr_0.8fr] md:gap-8 md:p-10">
            <div className="order-2 space-y-4 md:order-1 md:space-y-6">
              <h1 className="font-display uppercase leading-[1.1]">
                <span className="block text-[clamp(0.95rem,6vw,2.5rem)] sm:text-[clamp(1.7rem,5.2vw,3.8rem)]">
                  Hey There! I&apos;M
                </span>
                <span className="mt-1 block text-[clamp(1.05rem,8vw,3rem)] sm:text-[clamp(1.8rem,5.6vw,4.4rem)]">
                  <span className="retro-curve-underline">
                    <HyperNameReveal text="Voldigoade." />
                  </span>
                </span>
              </h1>
              <p className="max-w-2xl border-l-4 border-black pl-3 text-xs font-medium leading-relaxed sm:pl-4 sm:text-sm md:text-lg">
                Building software and exploring systems, security, privacy, and
                developer tools through public projects.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href="/contact">Contact Me</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="w-full border-4 border-black px-4 py-2 text-sm font-black uppercase tracking-wide shadow-retro retro-press sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                >
                  <Link href="/project">View Projects</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-56 border-4 border-black bg-primary p-2 shadow-retro-md sm:max-w-xs sm:p-3 md:order-2 md:max-w-sm">
              <div className="border-4 border-black bg-card p-0">
                <Image
                  src="/images/avatar.png"
                  alt="Voldigoade"
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
                  aria-label="GitHub profile"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="/project"
                  className="retro-social-icon"
                  aria-label="Explore projects"
                >
                  <Link2 className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="retro-social-icon"
                  aria-label="Contact Voldigoade"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Mission Control
        </h2>
        <BentoGrid>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase sm:text-2xl">
              Rust & Systems Projects
            </p>
            <p className="mt-3 font-medium leading-relaxed">
              Working on terminal-first tools in Rust, from public GitHub
              footprint inspection with Spoor to the early foundation of a
              firmware comparison tool in Crukst.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Messaging & Threat Models
            </p>
            <p className="mt-2 text-sm font-medium">
              Comparing secure messaging systems using public documentation,
              threat models, metadata exposure, and available audit evidence.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Open Source Tools & Spoor
            </p>
            <p className="mt-2 text-sm font-medium">
              Spoor inspects public GitHub profiles, repositories, commit
              identities, and keys. Reports keep source references and
              distinguish observations from inferences.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Privacy & Local Control
            </p>
            <p className="mt-2 text-sm font-medium">
              Exploring how software choices affect metadata exposure, reliance
              on external services, and control over local workflows.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Development Environments
            </p>
            <p className="mt-2 text-sm font-medium">
              IDE Research compares development environments across stacks,
              remote workflows, AI tools, security, privacy, and licensing.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Technical Writing & Research
            </p>
            <p className="mt-2 text-sm font-medium">
              Sharing source-linked comparisons in public research repositories.
              This site&apos;s Writing section is ready for future articles and
              notes.
            </p>
          </BentoCard>
        </BentoGrid>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Core Traits
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
            Featured Projects
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href="/project">View All</Link>
          </Button>
        </div>
        <ProjectsGrid compact limit={3} initialRepos={initialRepos} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Latest Writing
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full sm:w-auto uppercase"
          >
            <Link href="/blog">View All</Link>
          </Button>
        </div>
        <BlogGrid compact limit={3} initialPosts={initialPosts} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Github Stats
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              View Full GitHub Profile
            </Link>
          </Button>
        </div>
        <p className="font-bold uppercase text-muted-foreground">
          Followers, following, stars, forks, watchers, repositories, and GitHub
          activity analytics.
        </p>
        <GithubOverviewBento stats={githubOverview ?? null} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            {hackatime ? `${codingStatsProvider} Insights` : "Coding Activity"}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link
              href={codingStatsProfileUrl || githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {codingStatsProfileUrl
                ? `View ${codingStatsProvider} Profile`
                : "View GitHub Profile"}
            </Link>
          </Button>
        </div>
        <p className="font-bold uppercase text-muted-foreground">
          {hackatime
            ? `Tracked coding activity reported by ${codingStatsProvider}.`
            : "Tracked coding statistics are not available. Public project activity can be explored on GitHub."}
        </p>
        <HackatimeBento stats={hackatime ?? null} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Research Questions
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              body: "What can public GitHub metadata reveal, and where do observations stop and inferences begin?",
              title: "Public Footprints",
            },
            {
              body: "Which messaging app fits a particular threat model, and what metadata remains visible?",
              title: "Messaging Trade-offs",
            },
            {
              body: "How do development environments differ across remote work, AI tooling, privacy, and licensing?",
              title: "Developer Workflows",
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
          Explore & Contribute
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Explore the Source
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                Browse public repositories, read their documentation, and check
                what is implemented or still being explored.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View Public Repositories
                </Link>
              </Button>
            </Card.Content>
          </Card>

          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Share Project Feedback
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                Found a bug, an unclear explanation, or a source that needs an
                update? Feedback helps make the projects more useful.
              </p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase sm:text-4xl">
            Connect Hub
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={linkHubUrl} target="_blank" rel="noreferrer noopener">
              Open Link Hub
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
                    Open Link
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
              Let&apos;s Connect
            </h2>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-primary-foreground/90 sm:text-base">
              Have a question about a public project or an idea to explore? Send
              a message through the contact page or find the relevant repository
              on GitHub.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="w-full border-4 border-black bg-card text-card-foreground px-6 py-3 font-black uppercase shadow-retro retro-press sm:w-auto"
            >
              <Link href="/contact">Contact Me</Link>
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
