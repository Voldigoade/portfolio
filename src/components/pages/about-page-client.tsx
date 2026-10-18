"use client";

import { animate } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  AboutTimeline,
  type TimelineItem,
} from "@/components/portfolio/about-timeline";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Link2, Mail } from "@/components/retroui/icons";
import { githubUrl } from "@/lib/site-config";

type AboutPageClientProps = {
  timelineItems: TimelineItem[];
};

export function AboutPageClient({ timelineItems }: AboutPageClientProps) {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = aboutRef.current;
    if (!root) {
      return;
    }

    const revealTargets = root.querySelectorAll("[data-about-reveal]");
    const dnaTargets = root.querySelectorAll("[data-about-dna]");
    const principleTargets = root.querySelectorAll("[data-about-principle]");

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [18, 0],
      stagger: 70,
      duration: 320,
      ease: "outQuad",
    });

    animate(dnaTargets, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 180,
      stagger: 50,
      duration: 280,
      ease: "outQuad",
    });

    animate(principleTargets, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 320,
      stagger: 50,
      duration: 280,
      ease: "outQuad",
    });
  }, []);

  return (
    <div ref={aboutRef} className="space-y-8 pb-16">
      <section
        className="border-4 border-black bg-card p-6 shadow-retro-lg md:p-8"
        data-about-reveal
      >
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="mx-auto w-full max-w-xs border-4 border-black bg-primary p-3 shadow-retro-md">
            <div className="border-4 border-black bg-card p-0">
              <Image
                src="/images/avatar.png"
                alt="Voldigoade"
                width={420}
                height={420}
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

          <div>
            <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
              About
            </h1>
            <div className="mt-5 space-y-4 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              <p>
                Hey there, I&apos;m Voldigoade. I&apos;m building software and
                exploring systems, security, privacy, and developer tools
                through public projects.
              </p>
              <p>
                My projects include Spoor, a GitHub public-footprint inspection
                tool, and source-driven comparisons of secure messaging apps and
                development environments.
              </p>
              <p>
                I&apos;m learning through implementation and research. Each
                repository documents its own scope, evidence, and limitations,
                including work that is still experimental.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href="/project">Explore Projects</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Project Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Rust Tooling",
              detail:
                "Building terminal-first tools with Rust; Spoor inspects public GitHub profiles, repositories, commit identities, and keys.",
            },
            {
              title: "Messaging Research",
              detail:
                "Comparing messaging systems through public sources, threat models, metadata exposure, audits, and documented limitations.",
            },
            {
              title: "Developer Environments",
              detail:
                "Comparing IDEs, remote workflows, AI tooling, privacy, and licensing using source-linked evidence.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-4 border-black bg-secondary shadow-retro-md"
              data-about-principle
            >
              <Card.Header>
                <Card.Title className="font-display text-2xl uppercase text-secondary-foreground">
                  {item.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed text-secondary-foreground">
                  {item.detail}
                </p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Developer DNA
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            "Security questions: What information is exposed, who can observe it, and which assumptions matter?",
            "Learning through Rust: Build focused command-line tools and make their behavior easier to inspect.",
            "Privacy as a design question: Consider local control, external services, and the information a tool needs.",
            "Public evidence: Keep source references and distinguish observed data from assumptions and inferences.",
          ].map((point) => (
            <Card
              key={point}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-dna
            >
              <Card.Content>
                <p className="font-medium leading-relaxed">{point}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          How I Work
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            "Start with scope: identify the question, intended use, and limits of a project.",
            "Build iteratively: work on focused changes and check them against the intended behavior.",
            "Document uncertainty: link evidence and make unfinished or unverified behavior visible.",
          ].map((item) => (
            <Card
              key={item}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-principle
            >
              <Card.Content>
                <p className="font-medium leading-relaxed">{item}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="border-4 border-black bg-primary p-6 shadow-retro-lg md:p-8"
        data-about-reveal
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl uppercase text-primary-foreground sm:text-4xl">
            Public Project Map
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              View on GitHub
            </Link>
          </Button>
        </div>
        <AboutTimeline items={timelineItems} />
      </section>
    </div>
  );
}
