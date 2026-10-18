"use client";

import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/retroui/Card";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/retroui/terminal";

const stepLines = [
  {
    kind: "type",
    text: "$ spoor inspect Voldigoade --format json",
    className: "text-[#ff8d3b]",
  },
  {
    kind: "line",
    text: "[+] Scanning public repositories for Voldigoade...",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[+] Resolving public commit signatures and SSH keys...",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: '{"observed": {"repos": 4, "keys": "ed25519"}, "inferences": []}',
    className: "text-[#64cbff]",
  },
  {
    kind: "type",
    text: "$ spoor diff --target Voldigoade/spoor",
    className: "text-[#ff8d3b]",
  },
  {
    kind: "line",
    text: "[+] Checking audit trail and boundary constraints...",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "[✓] Boundary audit complete: 0 leaks, 0 private exposures.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Les limites d'analyse et la fraîcheur du cache conditionnent les résultats.",
    className: "text-[#ffc96b]",
  },
  {
    kind: "line",
    text: "$ spoor export report.json --format pdf -o report.pdf",
    className: "text-[#64cbff]",
  },
  {
    kind: "line",
    text: "# Les identités publiques ne présument pas de la propriété durable.",
    className: "text-[#84ff6f]",
  },
  {
    kind: "line",
    text: "# Cette animation est une illustration pédagogique sans exécution réelle.",
    className: "text-[#ffc96b]",
  },
];

type LogEntry = {
  id: number;
  item: (typeof stepLines)[number];
};

export function RetroTerminalSection() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= stepLines.length) {
        clearInterval(interval);
        return;
      }

      const item = stepLines[index];
      if (!item) {
        clearInterval(interval);
        return;
      }

      setEntries((prev) => [...prev, { id: index, item }]);
      index += 1;
    }, 450);

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
        Console d&apos;outillage Terminal
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-4 border-black bg-card shadow-retro-md">
          <Card.Header>
            <Card.Title className="font-display text-2xl uppercase">
              Aperçu de Spoor
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            <p className="font-medium leading-relaxed">
              Spoor est un outil en Rust conçu pour auditer les profils publics
              GitHub, dépôts, identités de commit et clés publiques depuis un
              terminal ou un service HTTP.
            </p>
            <p className="font-medium leading-relaxed">
              Le terminal ci-contre illustre les commandes documentées dans le
              README public. Il s&apos;agit d&apos;une simulation d&apos;usage
              sans exécution distante de code.
            </p>
            <p className="font-medium leading-relaxed">
              Consultez la documentation du dépôt avant utilisation. Les
              résultats dépendent des quotas d&apos;API, du cache local et de la
              disponibilité des données en ligne.
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
        Interprétation des résultats
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Données Observées
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Les métadonnées publiques constituent des faits vérifiables dotés
              d&apos;une source et d&apos;une date précise. Une adresse dans un
              ancien commit peut être historique.
            </p>
          </Card.Content>
        </Card>
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Valeurs Dérivées
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Les métriques agrégées et résumés calculés dépendent strictement
              des bornes d&apos;analyse et de la fraîcheur du cache de requêtes.
            </p>
          </Card.Content>
        </Card>
        <Card
          className="flex h-full flex-col border-4 border-black bg-card shadow-retro-md sm:col-span-2 xl:col-span-1"
          data-support-card
        >
          <Card.Header>
            <Card.Title className="font-display text-xl uppercase">
              Inférences Prudentes
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex-1">
            <p className="font-medium leading-relaxed">
              Les hypothèses et corrélations d&apos;outillage ne valent jamais
              preuve formelle. Elles doivent être corroborées par des éléments
              tiers.
            </p>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
