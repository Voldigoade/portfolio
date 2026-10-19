"use client";

import { ProjectsGrid } from "@/components/portfolio/projects-grid";
import type { GithubRepo } from "@/lib/portfolio-types";
import type { Locale } from "@/lib/site-copy";

type ProjectPageClientProps = {
  initialRepos: GithubRepo[];
  locale?: Locale;
};

export function ProjectPageClient({
  initialRepos,
  locale,
}: ProjectPageClientProps) {
  return <ProjectsGrid initialRepos={initialRepos} locale={locale} />;
}
