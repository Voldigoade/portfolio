"use client";

import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";

const models = [
  {
    title: "Systems & CLI Tools",
    summary:
      "Spoor provides a terminal interface and HTTP service for public GitHub inspection.",
    bullets: [
      "Rust command-line implementation",
      "HTTP lookups with streamed progress",
      "JSON and readable report exports",
    ],
  },
  {
    title: "Security & Threat Research",
    summary:
      "Recherche Messageries compares messaging systems using public sources and explicit limits.",
    bullets: [
      "Threat-model comparisons",
      "Metadata and network-exposure questions",
      "Source references and evidence registers",
    ],
  },
  {
    title: "Developer Environments",
    summary:
      "IDE Research compares complete working environments and the trade-offs between them.",
    bullets: [
      "Local, remote, and container workflows",
      "AI tooling and agent compatibility",
      "Privacy, licensing, and vendor dependence",
    ],
  },
] as const;

export function HomeEngagementModel() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Technical Focus Areas
        </h2>
        <Button
          asChild
          variant="secondary"
          className="w-full sm:w-auto uppercase"
        >
          <Link href="/project">Explore All Projects</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {models.map((model) => (
          <Card
            key={model.title}
            className="h-full border-4 border-black bg-card shadow-retro-md"
          >
            <Card.Header>
              <Card.Title className="font-display text-2xl uppercase">
                {model.title}
              </Card.Title>
              <Card.Description className="text-sm leading-relaxed sm:text-base">
                {model.summary}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-2">
                {model.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="border-l-4 border-black pl-3 text-sm font-medium leading-relaxed"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
