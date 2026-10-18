"use client";

import { animate } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  AboutTimeline,
  type TimelineItem,
} from "@/components/portfolio/about-timeline";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Github, Link2 } from "@/components/retroui/icons";
import { githubUrl } from "@/lib/site-config";

type AboutPageClientProps = {
  timelineItems: TimelineItem[];
};

export function AboutPageClient({ timelineItems }: AboutPageClientProps) {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = aboutRef.current;
    if (!root) {
      return;
    }

    const revealTargets = root.querySelectorAll("[data-about-reveal]");
    const dnaTargets = root.querySelectorAll("[data-about-dna]");
    const principleTargets = root.querySelectorAll("[data-about-principle]");

    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [18, 0],
      stagger: 70,
      duration: 320,
      ease: "outQuad",
    });

    animate(dnaTargets, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 180,
      stagger: 50,
      duration: 280,
      ease: "outQuad",
    });

    animate(principleTargets, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 320,
      stagger: 50,
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
                aria-label="Profil GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="/project"
                className="retro-social-icon"
                aria-label="Explorer les projets"
              >
                <Link2 className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="retro-social-icon"
                aria-label="Consulter le blog"
              >
                <Link2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h1 className="font-pixel text-3xl uppercase sm:text-4xl md:text-5xl">
              À propos
            </h1>
            <div className="mt-5 space-y-4 text-sm font-medium leading-relaxed sm:text-base md:text-lg">
              <p>
                Bonjour, je suis Voldigoade. Je conçois des logiciels et mène
                des recherches appliquées sur les systèmes, la sécurité, la
                confidentialité numérique et les outils pour développeurs à
                travers des projets open source.
              </p>
              <p>
                Mes travaux incluent notamment Spoor, un outil d&apos;inspection
                de l&apos;empreinte publique sur GitHub, ainsi que des analyses
                comparatives documentées sur les messageries sécurisées et les
                environnements de travail.
              </p>
              <p>
                J&apos;apprends par l&apos;implémentation directe et
                l&apos;analyse empirique. Chaque dépôt explicite son propre
                périmètre, son registre de preuves et ses limites, en
                distinguant clairement les aspects stabilisés des travaux
                expérimentaux.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href="/project">Explorer les projets</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
              >
                <Link href="/blog">Lire le blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Aperçu des Projets
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Outillage Rust",
              detail:
                "Conception d'outils CLI rapides et fiables en Rust. Spoor analyse les profils, dépôts, identités de commit et clés publiques sur GitHub.",
            },
            {
              title: "Recherche Messageries",
              detail:
                "Comparaison méthodique des applications sécurisées : modèles de menaces, métadonnées réseau, audits publics et limites attestées.",
            },
            {
              title: "Environnements Développeur",
              detail:
                "Étude comparative des IDEs : flux distants, outillage IA, gestion des dépendances cloud et garanties de vie privée.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-4 border-black bg-secondary shadow-retro-md"
              data-about-principle
            >
              <Card.Header>
                <Card.Title className="font-display text-2xl uppercase text-secondary-foreground">
                  {item.title}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="font-medium leading-relaxed text-secondary-foreground">
                  {item.detail}
                </p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          ADN d&apos;ingénierie
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            "Sécurité par la conception : Quelles données sont exposées, qui peut les intercepter et quelles hypothèses sont formulées ?",
            "Apprentissage par Rust : Développer des outils ciblés, sûrs pour la mémoire et simples à auditer.",
            "Vie privée par défaut : Privilégier le traitement local et minimiser strictement la transmission d'informations externes.",
            "Preuves vérifiables : Maintenir une traçabilité documentaire et séparer observations réelles et déductions logiques.",
          ].map((point) => (
            <Card
              key={point}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-dna
            >
              <Card.Content>
                <p className="font-medium leading-relaxed">{point}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" data-about-reveal>
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          Méthode de travail
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            "Définir le périmètre : Cerner avec précision la problématique, les cas d'usage et les contraintes techniques du projet.",
            "Construire itérativement : Développer par étapes vérifiables et confronter le code aux spécifications attendues.",
            "Documenter les limites : Référencer les sources et expliciter en toute transparence les travaux encore non stabilisés.",
          ].map((item) => (
            <Card
              key={item}
              className="border-4 border-black bg-card shadow-retro-md"
              data-about-principle
            >
              <Card.Content>
                <p className="font-medium leading-relaxed">{item}</p>
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
            Carte des Projets Publics
          </h2>
          <Button
            asChild
            variant="secondary"
            className="w-full border-4 border-black shadow-retro-sm sm:w-auto uppercase"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              Voir sur GitHub
            </Link>
          </Button>
        </div>
        <AboutTimeline items={timelineItems} />
      </section>
    </div>
  );
}
