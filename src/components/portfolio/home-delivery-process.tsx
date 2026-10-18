"use client";

import { Card } from "@/components/retroui/Card";

const processSteps = [
  {
    title: "Définir le périmètre",
    description:
      "Partir d'une problématique concrète, de son contexte d'usage et des limites précises de ce que le projet vise à résoudre.",
  },
  {
    title: "Investiguer",
    description:
      "S'appuyer sur la documentation primaire et le code source public ; consigner les références de chaque analyse.",
  },
  {
    title: "Construire minimal",
    description:
      "Développer une implémentation ciblée, documenter rigoureusement ce qui est fonctionnel et ce qui reste expérimental.",
  },
  {
    title: "Vérifier",
    description:
      "Tester les comportements réels, expliciter les compromis et réviser les conclusions à la lumière des faits.",
  },
] as const;

export function HomeDeliveryProcess() {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">Méthode</h2>
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
