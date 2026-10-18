"use client";

import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/retroui/Card";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/retroui/terminal";

const stepLines: Array<{
  kind: "type" | "line";
  text: string;
  className?: string;
}> = [
  {
    kind: "type",
    text: "$ # Spoor usage examples",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Illustrative commands from the public Spoor README.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "type",
    text: "$ spoor --help",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Explore the available commands and options.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Inspect public GitHub metadata.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "type",
    text: "$ spoor inspect Voldigoade",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Profiles, repositories, commit identities, and keys.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "line",
    text: "# Reports keep source references and distinguish inferences.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "type",
    text: "$ spoor repo Voldigoade/spoor",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Repository inspection has its own documented scope.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Choose a report format and output path.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "type",
    text: "$ spoor inspect Voldigoade -f json -o report.json",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# JSON retains the canonical report.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Readable exports are available in other formats.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Convert a saved report using the export command.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "line",
    text: "$ spoor export report.json --format pdf -o report.pdf",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Scan bounds, cache age, and provider availability matter.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "line",
    text: "# Public identities do not prove ownership or current contact details.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# This animation does not execute commands or show a live scan.",
    className: "text-[#ffc96b]",
  },
];

type LogEntry = {
  id: number;
  item: (typeof stepLines)[number];
};

export function RetroTerminalSection() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const indexRef = useRef(0);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasStarted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    setEntries([{ id: 0, item: stepLines[0] }]);
    indexRef.current = 1;
    idRef.current = 1;

    intervalRef.current = window.setInterval(() => {
      setEntries((prev) => {
        if (indexRef.current >= stepLines.length) {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        }

        const line = stepLines[indexRef.current];
        if (!line) {
          return prev;
        }

        const lastLine = prev.at(-1)?.item.text;
        if (lastLine === line.text) {
          indexRef.current += 1;
          return prev;
        }

        const next: LogEntry = { id: idRef.current, item: line };
        idRef.current += 1;
        const appended = [...prev, next];
        return appended.length > 24
          ? appended.slice(appended.length - 24)
          : appended;
      });
      indexRef.current += 1;
    }, 760);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [hasStarted]);

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
        Terminal Tooling Console
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-4 border-black bg-card shadow-retro-md">
          <Card.Header>
            <Card.Title className="font-display text-2xl uppercase">
              A Look at Spoor
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <p className="font-medium leading-relaxed">
              Spoor is a Rust tool for inspecting public GitHub profiles,
              repositories, commit identities, and keys from a terminal or HTTP
              client.
            </p>
            <p className="font-medium leading-relaxed">
              The terminal shows example commands from its public README. It is
              an illustration, not a live scan or a record of commands executed
              by this website.
            </p>
            <p className="font-medium leading-relaxed">
              Read the repository documentation before using the tool. Results
              depend on scan limits, cached data, and upstream provider
              availability.
            </p>
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
        Reading the Results
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Observed Data
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Public metadata is evidence with a source and a context. An
              address in an old commit may no longer be a contact address.
            </p>
          </Card.Content>
        </Card>
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Derived Values
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Computed summaries depend on the records available within the scan
              bounds and on the age of cached responses.
            </p>
          </Card.Content>
        </Card>
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md sm:col-span-2 xl:col-span-1"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Inference Limits
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Public identities do not prove ownership. Activity or timezone
              inferences do not establish a person&apos;s location.
            </p>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
