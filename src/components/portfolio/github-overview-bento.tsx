"use client";

import { animate, stagger } from "animejs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/retroui/Badge";
import { BentoCard, BentoGrid } from "@/components/retroui/Bento";
import { Button } from "@/components/retroui/Button";
import { BarChart } from "@/components/retroui/charts/BarChart";
import { LineChart } from "@/components/retroui/charts/LineChart";
import type { GitHubOverviewPayload } from "@/lib/portfolio-types";
import { githubUrl } from "@/lib/site-config";

export function GithubOverviewBento({
  stats,
}: {
  stats: GitHubOverviewPayload | null;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cards = Array.from(
      root.querySelectorAll("[data-gh-card]"),
    ) as HTMLElement[];
    const pills = Array.from(
      root.querySelectorAll("[data-gh-pill]"),
    ) as HTMLElement[];

    if (cards.length > 0) {
      animate(cards, {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(40, { start: 50 }),
        duration: 320,
        ease: "outCubic",
      });
    }

    if (pills.length > 0) {
      animate(pills, {
        opacity: [0, 1],
        scale: [0.92, 1],
        delay: stagger(35, { start: 260 }),
        duration: 380,
        ease: "outBack",
      });
    }
  }, []);

  if (!stats) {
    return (
      <div className="border-4 border-black bg-card p-6 text-center font-black uppercase shadow-retro-md">
        Les statistiques GitHub sont indisponibles actuellement.
      </div>
    );
  }

  const languageChartData = [...stats.languages].sort(
    (a, b) => b.repos - a.repos,
  );
  const insightsData = [
    {
      metric: "Moy. Étoiles",
      value:
        stats.totalStars === null
          ? null
          : Math.round(stats.totalStars / Math.max(stats.totalRepositories, 1)),
    },
    {
      metric: "Moy. Forks",
      value:
        stats.totalForks === null
          ? null
          : Math.round(stats.totalForks / Math.max(stats.totalRepositories, 1)),
    },
    {
      metric: "Moy. Suivis",
      value:
        stats.totalWatchers === null
          ? null
          : Math.round(
              stats.totalWatchers / Math.max(stats.totalRepositories, 1),
            ),
    },
    { metric: "Dépôts Publics", value: stats.publicRepos },
  ].flatMap((item) =>
    item.value === null ? [] : [{ ...item, value: item.value }],
  );

  return (
    <div ref={sectionRef}>
      <BentoGrid className="mx-auto w-full">
        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-4 self-start"
        >
          <p className="font-display text-2xl uppercase">Pouls GitHub</p>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            Données publiques agrégées sur les dépôts sélectionnés. Les
            métriques indisponibles sont omises.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ffe08a] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Abonnés {stats.followers ?? "N/D"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#8cf5ff] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Abonnements {stats.following ?? "N/D"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#b7ff66] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Dépôts {stats.totalRepositories}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ffd146] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Étoiles {stats.totalStars ?? "N/D"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ff9ac2] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Forks {stats.totalForks ?? "N/D"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#c6a8ff] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Suivis {stats.totalWatchers ?? "N/D"}
            </Badge>
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-4 self-start"
        >
          <p className="font-display text-2xl uppercase">
            Carte des Projets Publics
          </p>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            Sélection de projets open source et dépôts de recherche.
          </p>
          <div className="mt-4 grid min-h-44 grid-cols-1 gap-3 border-4 border-black bg-muted p-2 shadow-retro-sm sm:grid-cols-2 sm:p-3">
            {stats.projects.map((project) => (
              <Link
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-20 flex-col justify-center gap-1 border-2 border-black bg-card px-4 py-3 font-black uppercase shadow-retro-sm transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span className="break-all">{project.name}</span>
                <span className="text-xs text-muted-foreground">
                  {project.language ?? "Mixte"} · Dépôt public
                </span>
              </Link>
            ))}
          </div>
          <Button
            asChild
            variant="secondary"
            className="mt-4 w-full border-4 border-black uppercase sm:w-auto"
          >
            <Link href={githubUrl} target="_blank" rel="noreferrer noopener">
              Voir le profil GitHub complet
            </Link>
          </Button>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">
            Dépôts les plus étoilés
          </p>
          <div className="mt-3 h-72 w-full">
            {stats.topRepositories.length > 0 ? (
              <BarChart
                data={stats.topRepositories}
                index="name"
                categories={["stars"]}
                className="h-72"
                isAnimationActive={false}
                fillColors={["var(--chart-1)"]}
                strokeColors={["var(--foreground)"]}
                valueFormatter={(value) => `${value}`}
              />
            ) : (
              <p className="flex h-full items-center justify-center text-center font-bold uppercase">
                Le décompte d&apos;étoiles est indisponible.
              </p>
            )}
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">Langages utilisés</p>
          <div className="retro-scrollbar mt-3 max-h-96 overflow-y-auto overflow-x-hidden pr-2">
            <BarChart
              data={languageChartData}
              index="language"
              categories={["repos"]}
              className="h-112 w-full min-h-112"
              alignment="horizontal"
              isAnimationActive={false}
              horizontalYAxisWidth={116}
              horizontalCategoryFormatter={(value) =>
                value.length > 12 ? `${value.slice(0, 11)}.` : value
              }
              fillColors={["var(--chart-1)"]}
              strokeColors={["var(--foreground)"]}
              valueFormatter={(value) => `${value}`}
            />
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">
            Activité mensuelle des dépôts
          </p>
          <div className="mt-3 h-72 w-full">
            {stats.monthlyActivity.length > 0 ? (
              <LineChart
                data={stats.monthlyActivity}
                index="month"
                categories={["repos"]}
                className="h-72"
                isAnimationActive={false}
                strokeColors={["var(--chart-2)"]}
                valueFormatter={(value) => `${value}`}
              />
            ) : (
              <p className="flex h-full items-center justify-center text-center font-bold uppercase">
                Historique d&apos;activité non configuré.
              </p>
            )}
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">Indicateurs GitHub</p>
          <div className="mt-4 h-72 w-full">
            {insightsData.length > 0 ? (
              <BarChart
                data={insightsData}
                index="metric"
                categories={["value"]}
                className="h-72"
                alignment="horizontal"
                isAnimationActive={false}
                fillColors={["var(--chart-3)"]}
                strokeColors={["var(--foreground)"]}
                valueFormatter={(value) => `${value}`}
              />
            ) : (
              <p className="flex h-full items-center justify-center text-center font-bold uppercase">
                Métriques GitHub indisponibles.
              </p>
            )}
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed">
            Données calculées à partir des dépôts publics sélectionnés et du
            profil public.
          </p>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
