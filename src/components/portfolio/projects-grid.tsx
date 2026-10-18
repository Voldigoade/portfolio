"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  normalizeTag,
  ResponsiveTagFilter,
} from "@/components/portfolio/responsive-tag-filter";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Search } from "@/components/retroui/icons";
import { usePortfolioReposQuery } from "@/lib/client/portfolio-queries";
import type { GithubRepo } from "@/lib/portfolio-types";
import { getCopy, type Locale } from "@/lib/site-copy";
import { useProjectsStore } from "@/store/projects-store";

const PROJECTS_SKELETON_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;
const PROJECTS_TAG_SKELETON_KEYS = ["pt1", "pt2", "pt3"] as const;

function ProjectsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECTS_SKELETON_KEYS.map((key) => (
        <Card
          key={key}
          className="border-4 border-black bg-card p-4 shadow-retro-md"
        >
          <div className="space-y-3 animate-pulse">
            <div className="h-5 w-2/3 border-2 border-black bg-muted" />
            <div className="h-4 w-full border-2 border-black bg-muted" />
            <div className="h-4 w-5/6 border-2 border-black bg-muted" />
            <div className="flex gap-2">
              {PROJECTS_TAG_SKELETON_KEYS.map((tagKey) => (
                <div
                  key={tagKey}
                  className="h-6 w-14 border-2 border-black bg-muted"
                />
              ))}
            </div>
            <div className="h-10 w-full border-2 border-black bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  );
}

type ProjectsGridProps = {
  compact?: boolean;
  limit?: number;
  initialRepos?: GithubRepo[];
  locale?: Locale;
};

export function ProjectsGrid({
  compact = false,
  limit = 3,
  initialRepos,
  locale,
}: ProjectsGridProps) {
  const pathname = usePathname() || "/";
  const currentLocale: Locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : locale || "fr";

  const copy = getCopy(currentLocale).projects;
  const isFrench = currentLocale === "fr";

  const PAGE_SIZE = 9;
  const {
    data: repos = [],
    isLoading,
    isFetching,
    isError,
  } = usePortfolioReposQuery(initialRepos);
  const query = useProjectsStore((state) => state.query);
  const selectedTag = useProjectsStore((state) => state.selectedTag);
  const sortBy = useProjectsStore((state) => state.sortBy);
  const setQuery = useProjectsStore((state) => state.setQuery);
  const setSelectedTag = useProjectsStore((state) => state.setSelectedTag);
  const setSortBy = useProjectsStore((state) => state.setSortBy);

  useEffect(() => {
    if (compact) {
      return;
    }

    setSelectedTag("All");
  }, [compact, setSelectedTag]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();

    for (const tag of repos
      .flatMap((repo) => repo.topics ?? [])
      .filter(Boolean)) {
      const key = normalizeTag(tag);
      if (!key) {
        continue;
      }

      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const normalized = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key.toUpperCase());

    return ["All", ...normalized];
  }, [repos]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filteredRepos = repos.filter((repo) => {
      const normalizedTopics = (repo.topics ?? []).map((topic) =>
        normalizeTag(topic).toUpperCase(),
      );
      const matchesTag =
        compact ||
        selectedTag === "All" ||
        normalizedTopics.includes(selectedTag);

      const desc =
        currentLocale === "en"
          ? (repo.description_en ?? repo.description ?? "")
          : (repo.description ?? "");

      const haystack = [
        repo.name,
        desc,
        repo.language ?? "",
        ...(repo.topics ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesTag && (compact || haystack.includes(text));
    });

    return [...filteredRepos].sort((a, b) => {
      if (sortBy === "stars-desc") {
        return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
      }
      if (sortBy === "stars-asc") {
        return (a.stargazers_count ?? 0) - (b.stargazers_count ?? 0);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return (
        new Date(b.updated_at ?? 0).getTime() -
        new Date(a.updated_at ?? 0).getTime()
      );
    });
  }, [repos, query, selectedTag, sortBy, compact, currentLocale]);

  const visible = compact ? filtered.slice(0, limit) : filtered;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setQuery(value);
  };

  const handleTagChange = (value: string) => {
    setCurrentPage(1);
    setSelectedTag(value);
  };

  const handleSortChange = (
    value: "recent" | "stars-desc" | "stars-asc" | "name-asc",
  ) => {
    setCurrentPage(1);
    setSortBy(value);
  };

  const totalPages = compact
    ? 1
    : Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paginated = compact
    ? visible
    : visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-6">
      {!compact ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchAria}
              className="w-full border-4 border-black bg-card py-3 pl-11 font-bold shadow-retro"
            />
          </div>
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_14rem] xl:items-start">
            <div className="min-w-0">
              <ResponsiveTagFilter
                tags={tags}
                selectedTag={selectedTag}
                onSelect={handleTagChange}
                maxVisible={5}
              />
            </div>
            <div className="w-full">
              <select
                value={sortBy}
                onChange={(event) =>
                  handleSortChange(
                    event.target.value as
                      | "recent"
                      | "stars-desc"
                      | "stars-asc"
                      | "name-asc",
                  )
                }
                className="h-11 w-full border-4 border-black bg-card px-3 font-black uppercase shadow-retro"
                aria-label={copy.sortAria}
              >
                <option value="recent">{copy.sortRecent}</option>
                <option value="stars-desc">{copy.sortStarsDesc}</option>
                <option value="stars-asc">{copy.sortStarsAsc}</option>
                <option value="name-asc">{copy.sortNameAsc}</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}

      {isLoading || isFetching ? <ProjectsSkeletonGrid /> : null}

      {isError ? (
        <div className="border-4 border-black bg-destructive p-5 font-black uppercase text-destructive-foreground shadow-retro-md">
          {copy.errorState}
        </div>
      ) : null}

      {!isLoading && !isFetching ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            {paginated.map((repo, index) => {
              const description =
                currentLocale === "en"
                  ? (repo.description_en ??
                    repo.description ??
                    copy.noDescription)
                  : (repo.description ?? copy.noDescription);

              return (
                <motion.div
                  key={repo.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="flex h-full w-full flex-col border-4 border-black shadow-retro-md hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                    <Card.Header
                      className={
                        compact
                          ? "min-h-0 flex-1"
                          : "min-h-40 flex-1 sm:min-h-44"
                      }
                    >
                      <Card.Title className="break-all font-display text-xl uppercase">
                        {repo.name}
                      </Card.Title>
                      <Card.Description
                        className={
                          compact
                            ? "mt-2 text-sm leading-relaxed line-clamp-3"
                            : "mt-2 text-sm leading-relaxed sm:text-base line-clamp-4"
                        }
                      >
                        {description}
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="mt-auto flex flex-col gap-4 pt-0">
                      <div className="flex flex-wrap gap-2">
                        {(repo.topics ?? [])
                          .slice(0, compact ? 4 : 8)
                          .map((topic) => (
                            <span
                              key={topic}
                              title={topic}
                              className="retro-badge max-w-full truncate text-[10px] sm:text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        {(repo.topics ?? []).length > (compact ? 4 : 8) ? (
                          <span className="retro-badge text-[10px] sm:text-xs">
                            +{(repo.topics ?? []).length - (compact ? 4 : 8)}
                          </span>
                        ) : null}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase sm:grid-cols-4">
                        <span className="min-w-0 rounded-none border-2 border-black bg-muted px-2 py-1 text-center">
                          <span className="block truncate">
                            {isFrench ? "Langage" : "Language"}
                          </span>
                          <span className="block truncate text-[11px]">
                            {repo.language ?? (isFrench ? "Mixte" : "Mixed")}
                          </span>
                        </span>
                        <span className="min-w-0 rounded-none border-2 border-black bg-muted px-2 py-1 text-center">
                          <span className="block truncate">
                            {isFrench ? "Étoiles" : "Stars"}
                          </span>
                          <span className="block truncate text-[11px]">
                            {repo.stargazers_count ?? "N/D"}
                          </span>
                        </span>
                        <span className="min-w-0 rounded-none border-2 border-black bg-muted px-2 py-1 text-center">
                          <span className="block truncate">Forks</span>
                          <span className="block truncate text-[11px]">
                            {repo.forks_count ?? "N/D"}
                          </span>
                        </span>
                        <span className="min-w-0 rounded-none border-2 border-black bg-muted px-2 py-1 text-center">
                          <span className="block truncate">
                            {isFrench ? "Suivis" : "Watchers"}
                          </span>
                          <span className="block truncate text-[11px]">
                            {repo.watchers_count ?? "N/D"}
                          </span>
                        </span>
                      </div>
                      {repo.homepage ? (
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            asChild
                            className="w-full justify-center border-4 border-black shadow-retro-sm uppercase"
                          >
                            <Link
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {copy.viewRepo}
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="secondary"
                            className="w-full justify-center border-4 border-black shadow-retro-sm uppercase"
                          >
                            <Link
                              href={repo.homepage}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {isFrench ? "Consulter le site" : "Visit website"}
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          asChild
                          className="w-full justify-center border-4 border-black shadow-retro-sm uppercase"
                        >
                          <Link
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {copy.viewRepo}
                          </Link>
                        </Button>
                      )}
                    </Card.Content>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      ) : null}

      {!isLoading && !isFetching && visible.length === 0 ? (
        <div className="border-4 border-black bg-muted p-6 text-center font-black uppercase shadow-retro">
          {copy.emptyState}
        </div>
      ) : null}

      {!compact && !isLoading && !isFetching && visible.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 border-4 border-black bg-card p-3 shadow-retro-sm">
          <Button
            variant="secondary"
            className="border-4 border-black uppercase"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            {isFrench ? "Précédent" : "Previous"}
          </Button>

          <span className="min-w-28 border-2 border-black bg-muted px-3 py-2 text-center text-xs font-black uppercase">
            Page {currentPage} / {totalPages}
          </span>

          <Button
            variant="secondary"
            className="border-4 border-black uppercase"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            {isFrench ? "Suivant" : "Next"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
