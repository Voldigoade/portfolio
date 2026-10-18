"use client";

import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";

const models = [
  {
    title: "Systèmes & Outils CLI",
    summary:
      "Spoor propose une interface terminal et un service HTTP pour l'inspection de l'empreinte publique sur GitHub.",
    bullets: [
      "Implémentation en ligne de commande en Rust",
      "Requêtes HTTP avec suivi de progression en temps réel",
      "Export JSON et rapports d'audit lisibles",
    ],
  },
  {
    title: "Sécurité & Modélisation de menaces",
    summary:
      "Recherche Messageries analyse les applications de messagerie sécurisée à partir de sources publiques et de critères vérifiables.",
    bullets: [
      "Comparatifs selon les modèles de menaces",
      "Analyse des métadonnées et de l'exposition réseau",
      "Registre des preuves et traçabilité documentaire",
    ],
  },
  {
    title: "Environnements de développement",
    summary:
      "IDE Research étudie les architectures d'environnements de travail et leurs compromis opérationnels.",
    bullets: [
      "Flux locaux, distants et conteneurisés",
      "Intégration d'outils et d'agents de développement",
      "Confidentialité, licences et souveraineté logicielle",
    ],
  },
] as const;

export function HomeEngagementModel() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Domaines de recherche & outillage
        </h2>
        <Button
          asChild
          variant="secondary"
          className="w-full sm:w-auto uppercase"
        >
          <Link href="/project">Explorer tous les projets</Link>
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
