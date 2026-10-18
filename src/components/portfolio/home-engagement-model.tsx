"use client";

import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";

const models = [
  {
    title: "Systems & CLI Tools",
    summary:
      "Terminal-first tooling, low-level services, and system utilities built in Rust.",
    bullets: [
      "Fast native binary execution",
      "HTTP and Server-Sent Event streaming APIs",
      "Structured machine-readable JSON exports",
    ],
  },
  {
    title: "Security & Threat Research",
    summary:
      "Source-driven comparative analysis of privacy, cryptography, and network protocols.",
    bullets: [
      "Threat model and boundary evaluation",
      "Network exposure and metadata auditing",
      "Evidence registers with primary source citations",
    ],
  },
  {
    title: "Local-First & Tooling",
    summary:
      "Software designed to run locally, keep state deterministic, and respect privacy.",
    bullets: [
      "Local-first data persistence",
      "Automation and agent workflow integrations",
      "Zero unnecessary telemetry or tracking",
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
