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
import { Github, Linkedin, Twitter } from "@/components/retroui/icons";
import { githubUrl, linkedinUrl, xUrl } from "@/lib/site-config";

type AboutPageClientProps = {
  timelineItems: TimelineItem[];
};

export function AboutPageClient({ timelineItems }: AboutPageClientProps) {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

          <div>
            <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
              About
            </h1>
            <div className="mt-5 space-y-4 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              <p>
                Hey there, I&apos;m Voldigoade, a software engineer and systems
                researcher focused on security, privacy, memory safety, and
                open-source tooling.
              </p>
              <p>
                I build auditable software with minimal attack surfaces, threat
                model communication protocols, and design developer-first
                utilities that prioritize user sovereignty.
              </p>
              <p>
                My primary work revolves around Rust, Linux internals, defensive
                architecture, and local-first systems. I believe in public code
                verification, reproducible builds, and transparency.
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
          Execution Snapshot
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Systems Programming",
              detail:
                "Low-level, memory-safe utilities and backend systems in Rust and Linux engineered for predictability.",
            },
            {
              title: "Security & Threat Research",
              detail:
                "Deep auditing of metadata leakage, credential isolation, and cryptographic protocol trade-offs.",
            },
            {
              title: "Open Source Tooling",
              detail:
                "Transparent, inspectable tools like Spoor designed with zero telemetry and permissive licenses.",
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
            "Defensive by default: I design software under the assumption of hostile network environments and credential exposure.",
            "Systems & Rust: Memory safety and zero-cost abstractions allow building fast, auditable tools without garbage collection overhead.",
            "Local-first & sovereignty: User data should remain encrypted, local, and under direct user control whenever possible.",
            "Inspectable engineering: Open-source code, reproducible builds, and explicit dependencies over opaque black boxes.",
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
            "Threat model first: define attack surfaces, trust boundaries, and data flows before writing code.",
            "Build iteratively: ship minimal, auditable increments with verifiable tests and clear invariants.",
            "Document and benchmark: leave systems thoroughly documented with reproducible benchmarks and zero hidden surprises.",
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
            Experience Journey
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
