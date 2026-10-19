"use client";

import { animate } from "animejs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/retroui/terminal";
import { getCopy, type Locale } from "@/lib/site-copy";

const spoorLines = [
  {
    kind: "type",
    text: "$ spoor torvalds",
    className: "text-[#ff8d3b]",
  },
  {
    kind: "line",
    text: "[init] torvalds in fast mode",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[resolve] target type: user",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[query] GitHub REST: Fetching user profile",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[ok] Profile resolved for 'torvalds' (Linus Torvalds)",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "[query] GitHub REST: Fetching public repositories",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[ok] Retrieved 12 repositories (★ 265,996 · ⑂ 69,583)",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "[query] GitHub Commit Search: Searching global commits",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[scan] Inspecting repositories (torvalds/linux, subsurface...)",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[query] GitHub Keys: Fetching public GPG and SSH keys",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[done] completed in 13.11s",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "------------------------------------------------------------",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "TARGET: torvalds (Linus Torvalds)",
    className: "text-[#ffc96b]",
  },
  {
    kind: "line",
    text: "Repositories: 12 · Stars: 265,996 · Forks: 69,583",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "Top Languages: C (10), C++ (1), OpenSCAD (1)",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "Public Keys: 1 SSH key · 0 GPG keys",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "Coverage: 412 commits analyzed across 8 repositories",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "Leaks flagged in this run: 0",
    className: "text-[#64cbff]",
  },
];

type LogEntry = {
  id: number;
  item: (typeof spoorLines)[number];
};

export function RetroTerminalSection({ locale }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale).home.terminal;
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= spoorLines.length) {
        clearInterval(interval);
        return;
      }

      const item = spoorLines[index];
      if (!item) {
        clearInterval(interval);
        return;
      }

      setEntries((prev) => [...prev, { id: index, item }]);
      index += 1;
    }, 380);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) {
      return;
    }

    const supportCards = root.querySelectorAll("[data-support-card]");
    animate(supportCards, {
      opacity: [0, 1],
      translateY: [12, 0],
      stagger: 75,
      duration: 300,
      ease: "outQuad",
    });
  }, []);

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }

    const node = bodyRef.current;
    if (!node) {
      return;
    }

    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [entries]);

  return (
    <section ref={sectionRef} className="space-y-4" data-anim="item">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">
        {copy.title}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-4 border-black bg-card shadow-retro-md">
          <Card.Header>
            <Card.Title className="font-display text-2xl uppercase">
              {copy.cardTitle}
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <p className="font-medium leading-relaxed">{copy.p1}</p>
            <p className="font-medium leading-relaxed">{copy.p2}</p>
            <p className="font-medium leading-relaxed">{copy.p3}</p>
            <div className="pt-2">
              <Button
                asChild
                variant="secondary"
                className="border-4 border-black font-black uppercase shadow-retro-sm"
              >
                <Link
                  href="https://github.com/Voldigoade/spoor"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {copy.docLink}
                </Link>
              </Button>
            </div>
          </Card.Content>
        </Card>

        <Terminal
          className="h-[22rem] md:h-[24rem]"
          bodyRef={bodyRef}
          bodyClassName="retro-terminal-scrollbar pr-3"
        >
          {entries.map((entry) =>
            entry.item.kind === "type" ? (
              <TypingAnimation key={entry.id} className={entry.item.className}>
                {entry.item.text}
              </TypingAnimation>
            ) : (
              <AnimatedSpan key={entry.id} className={entry.item.className}>
                {entry.item.text}
              </AnimatedSpan>
            ),
          )}
        </Terminal>
      </div>

      <h3 className="font-display text-2xl uppercase sm:text-3xl">
        {copy.resultsTitle}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {copy.cards.map((c, i) => (
          <Card
            key={c.title}
            className={`flex h-full flex-col border-4 border-black bg-card shadow-retro-md ${
              i === 2 ? "sm:col-span-2 xl:col-span-1" : ""
            }`}
            data-support-card
          >
            <Card.Header>
              <Card.Title className="font-display text-xl uppercase">
                {c.title}
              </Card.Title>
            </Card.Header>
            <Card.Content className="flex-1">
              <p className="font-medium leading-relaxed">{c.text}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
