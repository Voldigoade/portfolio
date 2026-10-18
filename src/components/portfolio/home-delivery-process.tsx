"use client";

import { Card } from "@/components/retroui/Card";

const processSteps = [
  {
    title: "Define Scope",
    description:
      "Start with a question, its intended use, and the limits of what the project can answer.",
  },
  {
    title: "Investigate",
    description:
      "Look for primary documentation and public source code; keep references for claims.",
  },
  {
    title: "Build Minimal",
    description:
      "Work on a focused implementation and document what is still planned or experimental.",
  },
  {
    title: "Verify",
    description:
      "Check behavior, record limitations, and revisit conclusions when the evidence changes.",
  },
] as const;

export function HomeDeliveryProcess() {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">
        Working Principles
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
