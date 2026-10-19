"use client";

import { animate } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  AboutTimeline,
  type TimelineItem,
} from "@/components/portfolio/about-timeline";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Link2 } from "@/components/retroui/icons";
import { githubUrl } from "@/lib/site-config";
import { getCopy, type Locale } from "@/lib/site-copy";

type AboutPageClientProps = {
  timelineItems: TimelineItem[];
  locale?: Locale;
};

export function AboutPageClient({
  timelineItems,
  locale,
}: AboutPageClientProps) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale).about;
  const isFrench = currentLocale === "fr";
  const aboutRef = useRef<HTMLDivElement>(null);

  const projectsHref = isFrench ? "/project" : "/en/project";
  const blogHref = isFrench ? "/blog" : "/en/blog";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = aboutRef.current;
    if (!root) {
      return;
    }

    const revealTargets = root.querySelectorAll("[data-about-reveal]");
    const cardTargets = root.querySelectorAll("[data-about-card]");

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [18, 0],
      stagger: 70,
      duration: 320,
      ease: "outQuad",
    });

    animate(cardTargets, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 180,
      stagger: 40,
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
                alt="Emblème Voldigoade"
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
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href={projectsHref}
                className="retro-social-icon"
                aria-label={
                  isFrench ? "Explorer les projets" : "Explore projects"
                }
              >
                <Link2 className="h-4 w-4" />
              </Link>
              <Link
                href={blogHref}
                className="retro-social-icon"
                aria-label={isFrench ? "Consulter le blog" : "Browse blog"}
              >
                <Link2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
              {copy.title}
            </h1>
            <div className="mt-5 space-y-4 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              {copy.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href={projectsHref}>{copy.projectsCta}</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href={blogHref}>{copy.blogCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {copy.focusTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.focusItems.map((item) => (
            <Card
              key={item.title}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-card
            >
              <Card.Header>
                <Card.Title className="font-display text-xl uppercase">
                  {item.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed">{item.text}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          {copy.stackTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {copy.stackItems.map((item) => (
            <Card
              key={item.title}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-card
            >
              <Card.Header>
                <Card.Title className="font-display text-lg uppercase text-primary">
                  {item.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed">{item.detail}</p>
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
            {copy.reposTitle}
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              {copy.reposCta}
            </Link>
          </Button>
        </div>
        <AboutTimeline items={timelineItems} />
      </section>
    </div>
  );
}
