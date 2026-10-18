"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
// Hero section components — loaded eagerly (above the fold, must render immediately)
import { HeroFloatingBadges } from "@/components/portfolio/hero-floating-badges";
import { HyperNameReveal } from "@/components/portfolio/hyper-name-reveal";
import { StatsMarquee } from "@/components/portfolio/stats-marquee";
import { BentoCard, BentoGrid } from "@/components/retroui/Bento";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Linkedin, Twitter } from "@/components/retroui/icons";

// Below-the-fold components — lazy loaded for performance
const BlogGrid = dynamic(
  () => import("@/components/portfolio/blog-grid").then((m) => m.BlogGrid),
  { ssr: false },
);
const GithubOverviewBento = dynamic(
  () =>
    import("@/components/portfolio/github-overview-bento").then(
      (m) => m.GithubOverviewBento,
    ),
  { ssr: false },
);
const HackatimeBento = dynamic(
  () =>
    import("@/components/portfolio/hackatime-bento").then(
      (m) => m.HackatimeBento,
    ),
  { ssr: false },
);
const HomeDeliveryProcess = dynamic(
  () =>
    import("@/components/portfolio/home-delivery-process").then(
      (m) => m.HomeDeliveryProcess,
    ),
  { ssr: false },
);
const HomeEngagementModel = dynamic(
  () =>
    import("@/components/portfolio/home-engagement-model").then(
      (m) => m.HomeEngagementModel,
    ),
  { ssr: false },
);
const MorphScrollShowcase = dynamic(
  () =>
    import("@/components/portfolio/morph-scroll-showcase").then(
      (m) => m.MorphScrollShowcase,
    ),
  { ssr: false },
);
const ProjectsGrid = dynamic(
  () =>
    import("@/components/portfolio/projects-grid").then((m) => m.ProjectsGrid),
  { ssr: false },
);
const RetroCodeShowcase = dynamic(
  () =>
    import("@/components/portfolio/retro-code-showcase").then(
      (m) => m.RetroCodeShowcase,
    ),
  { ssr: false },
);
const RetroTerminalSection = dynamic(
  () =>
    import("@/components/portfolio/retro-terminal-section").then(
      (m) => m.RetroTerminalSection,
    ),
  { ssr: false },
);

import { links } from "@/lib/link-items";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  HackatimePayload,
} from "@/lib/portfolio-types";
import {
  donationUrl,
  githubUrl,
  linkedinUrl,
  linkHubUrl,
  siteHost,
  sponsorUrl,
  xUrl,
} from "@/lib/site-config";
import { useHomeStore } from "@/store/home-store";

const traits = [
  {
    title: "Systems & Security Focus",
    text: "Building auditable, resilient software with careful threat modeling, strict isolation, and clean architecture.",
  },
  {
    title: "Rust & Systems Tooling",
    text: "Designing high-performance CLI utilities, memory-safe system tools, and inspectable developer workflows.",
  },
  {
    title: "Local-First & Privacy",
    text: "Prioritizing user data ownership, client-side encryption, and minimal external surface area.",
  },
  {
    title: "Open Source Engineering",
    text: "Documenting research, sharing reproducible benchmarks, and contributing clean, inspectable code.",
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
    question: "What technical domains do you specialize in?",
    answer:
      "My primary work centers on systems programming (Rust, C, Linux), security research (threat modeling, metadata auditing, credential isolation), and developer tooling.",
  },
  {
    question: "What is Spoor?",
    answer:
      "Spoor is an open-source footprint scanner designed to audit public GitHub activity, assess developer exposure, and identify unintended data leaks.",
    ctaHref: "https://github.com/Voldigoade/spoor",
    ctaLabel: "View Spoor",
  },
  {
    question: "What stack and tools do you use?",
    answer:
      "For systems and CLI tools, I rely heavily on Rust and Linux environments. For web tooling, research interfaces, and data pipelines, I use TypeScript, React/Next.js, Python, and SQLite.",
  },
  {
    question: "Are your projects open source?",
    answer:
      "Yes. The majority of my tools, research write-ups, and benchmarks are published publicly under permissive open-source licenses on GitHub.",
    ctaHref: githubUrl,
    ctaLabel: "GitHub Profile",
  },
  {
    question: "How can I get in touch?",
    answer:
      "You can reach out through the contact form on this site, find me on GitHub discussions and issues, or open a conversation on Matrix/GitHub.",
    ctaHref: "/contact",
    ctaLabel: "Contact Page",
  },
  {
    question: "Do you publish technical write-ups?",
    answer:
      "Yes. I regularly write detailed articles, vulnerability case studies, and engineering postmortems in the Writing section.",
    ctaHref: "/blog",
    ctaLabel: "Read Articles",
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
  const focus = useHomeStore((state) => state.focus);
  const setFocus = useHomeStore((state) => state.setFocus);

  const focusItems = [
    {
      key: "Systems",
      title: "Systems & Infrastructure",
      body: "Building reliable system software, low-level tooling, and memory-safe utilities in Rust, Linux, and modern TypeScript.",
    },
    {
      key: "Security",
      title: "Security & Threat Research",
      body: "Auditing protocols, analyzing credential footprints, evaluating threat models, and assessing privacy trade-offs.",
    },
    {
      key: "Open Source",
      title: "Open Source & Reproducibility",
      body: "Publishing inspectable tools, open datasets, and clear documentation with zero hidden telemetry or lock-in.",
    },
    {
      key: "Tooling",
      title: "Developer & CLI Tooling",
      body: "Crafting ergonomic developer tools, automation scripts, and workflow utilities that respect developer focus.",
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
                Software engineer and systems researcher focused on security,
                privacy, memory safety, and developer-first open source tooling.
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
                  href={xUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="retro-social-icon"
                  aria-label="X profile"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="retro-social-icon"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="h-4 w-4" />
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
              Systems Engineering & Architecture
            </p>
            <p className="mt-3 font-medium leading-relaxed">
              Designing memory-safe, auditable system utilities and backend
              services in Rust, Linux, and TypeScript, engineered for
              predictability and low resource footprint.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Security & Threat Modeling
            </p>
            <p className="mt-2 text-sm font-medium">
              Mapping attack surfaces, analyzing network metadata and credential
              exposure, and designing defense-in-depth isolation for critical
              workflows.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Open Source Tools & Spoor
            </p>
            <p className="mt-2 text-sm font-medium">
              Developing inspectable open-source tools like Spoor for automated
              GitHub footprint auditing, credential risk evaluation, and
              developer security.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Local-First & Data Sovereignty
            </p>
            <p className="mt-2 text-sm font-medium">
              Prioritizing offline-first storage, client-side encryption, and
              minimal telemetry to ensure data stays under the user&apos;s
              direct control.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Auditable & Deterministic Pipelines
            </p>
            <p className="mt-2 text-sm font-medium">
              Building reproducible build environments, clean dependency graphs,
              and continuous validation gates with zero proprietary lock-in.
            </p>
          </BentoCard>
          <BentoCard className="min-h-48 h-full sm:col-span-1 lg:col-span-2">
            <p className="font-display text-xl uppercase">
              Technical Writing & Research
            </p>
            <p className="mt-2 text-sm font-medium">
              Documenting architecture decisions, threat assessments, and
              benchmarks in deep, rigorous technical write-ups and research
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
            {process.env.NEXT_PUBLIC_CODING_STATS_PROVIDER === "hackatime"
              ? "Hackatime Insights"
              : "Wakatime Insights"}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link
              href={
                process.env.NEXT_PUBLIC_CODING_STATS_PROFILE_URL || githubUrl
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              View{" "}
              {process.env.NEXT_PUBLIC_CODING_STATS_PROVIDER === "hackatime"
                ? "HackClub"
                : "Wakatime"}{" "}
              Profile
            </Link>
          </Button>
        </div>
        <p className="font-bold uppercase text-muted-foreground">
          {process.env.NEXT_PUBLIC_CODING_STATS_PROVIDER === "hackatime"
            ? "Live coding insights from Hack Club for the last 7 days and total tracked development time."
            : "Live coding insights from Wakatime for the last 7 days and total tracked development time."}
        </p>
        <HackatimeBento stats={hackatime ?? null} />
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              quote:
                "Deep attention to system details, threat modeling, and defensive architecture.",
              by: "Systems Engineer",
            },
            {
              quote:
                "Exceptional code clarity, rigorous testing, and pragmatic security trade-offs.",
              by: "Security Researcher",
            },
            {
              quote:
                "High-integrity open-source development with thorough documentation and clean tooling.",
              by: "Open Source Contributor",
            },
          ].map((item) => (
            <Card
              key={item.by}
              className="flex h-full w-full flex-col border-4 border-black bg-card shadow-retro-md retro-press"
            >
              <Card.Content className="flex h-full min-h-44 flex-col gap-4">
                <p className="text-lg font-bold leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-auto text-sm font-black uppercase text-muted-foreground">
                  {item.by}
                </p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-home-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Donate & Sponsor
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Support via GitHub Sponsors
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                Fund open-source work and long-term product experiments through
                GitHub Sponsors.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href={sponsorUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Sponsor on GitHub
                </Link>
              </Button>
            </Card.Content>
          </Card>

          <Card className="w-full border-4 border-black bg-card shadow-retro-md retro-press">
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                Direct Donation
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <p className="font-medium">
                If my content, products, or OSS work helped you, you can donate
                directly here.
              </p>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link
                  href={donationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Donate Now
                </Link>
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
              Interested in collaborating on open-source systems, security
              audits, or technical research? Send a message through the contact
              form or connect via GitHub.
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
