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
        GitHub overview is unavailable right now.
      </div>
    );
  }

  const languageChartData = [...stats.languages].sort(
    (a, b) => b.repos - a.repos,
  );
  const insightsData = [
    {
      metric: "Stars Avg",
      value:
        stats.totalStars === null
          ? null
          : Math.round(stats.totalStars / Math.max(stats.totalRepositories, 1)),
    },
    {
      metric: "Forks Avg",
      value:
        stats.totalForks === null
          ? null
          : Math.round(stats.totalForks / Math.max(stats.totalRepositories, 1)),
    },
    {
      metric: "Watch Avg",
      value:
        stats.totalWatchers === null
          ? null
          : Math.round(
              stats.totalWatchers / Math.max(stats.totalRepositories, 1),
            ),
    },
    { metric: "Public Repos", value: stats.publicRepos },
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
          <p className="font-display text-2xl uppercase">GitHub Pulse</p>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            Project totals cover the curated public repositories. Unavailable
            metrics are omitted.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ffe08a] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Followers {stats.followers ?? "Unavailable"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#8cf5ff] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Following {stats.following ?? "Unavailable"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#b7ff66] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Repos {stats.totalRepositories}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ffd146] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Stars {stats.totalStars ?? "Unavailable"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#ff9ac2] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Forks {stats.totalForks ?? "Unavailable"}
            </Badge>
            <Badge
              data-gh-pill
              variant="surface"
              className="justify-center border-2 border-black bg-[#c6a8ff] px-3 py-3 text-center text-sm font-black uppercase text-black"
            >
              Watch {stats.totalWatchers ?? "Unavailable"}
            </Badge>
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-4 self-start"
        >
          <p className="font-display text-2xl uppercase">Public Project Map</p>
          <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
            A curated selection of public code and research repositories.
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
                  {project.language ?? "Mixed"} · Public repository
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
              View Full GitHub Profile
            </Link>
          </Button>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">
            Top Repositories by Stars
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
                Live star counts are unavailable.
              </p>
            )}
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">
            Languages Used Across Projects
          </p>
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
            Repository Activity by Month
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
                Public repository activity history is not configured.
              </p>
            )}
          </div>
        </BentoCard>

        <BentoCard
          data-gh-card
          className="sm:col-span-2 lg:col-span-2 self-start min-h-96 h-full"
        >
          <p className="font-display text-2xl uppercase">GitHub Insights</p>
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
                Live GitHub metrics are unavailable.
              </p>
            )}
          </div>
          <p className="mt-4 text-sm font-medium leading-relaxed">
            Available metrics from curated public projects and the public GitHub
            profile.
          </p>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
