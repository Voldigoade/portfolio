"use client";

import { Card } from "@/components/retroui/Card";

const processSteps = [
  {
    title: "Threat Model",
    description:
      "Examine problem boundaries, trust assumptions, and operational constraints before committing to code.",
  },
  {
    title: "Investigate",
    description:
      "Cross-check primary documentation, network traces, and public source code to expose the underlying mechanics.",
  },
  {
    title: "Build Minimal",
    description:
      "Implement focused, lightweight tools in Rust, Python, or TypeScript with deliberate dependency boundaries.",
  },
  {
    title: "Verify",
    description:
      "Validate through automated test suites, structured output verification, and transparent evidence registers.",
  },
] as const;

export function HomeDeliveryProcess() {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">
        Engineering Workflow
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <Card
            key={step.title}
            className="h-full border-4 border-black bg-card shadow-retro-md"
          >
            <Card.Header>
              <p className="retro-badge w-max text-[10px] sm:text-xs">
                Phase {index + 1}
              </p>
              <Card.Title className="mt-2 font-display text-2xl uppercase">
                {step.title}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="font-medium leading-relaxed">{step.description}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
