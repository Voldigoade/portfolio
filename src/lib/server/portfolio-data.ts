import "server-only";
import { getBlogPostsForListing } from "@/lib/blog";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  WritingLocale,
} from "@/lib/portfolio-types";

export const DEFAULT_GITHUB_USER = "Voldigoade";
const GITHUB_CACHE_REVALIDATE_SECONDS = 60 * 60 * 12;
const REQUEST_TIMEOUT_MS = 8_000;
export type CuratedProject = Omit<
  GithubRepo,
  "stargazers_count" | "forks_count" | "watchers_count" | "updated_at"
>;

// Independently curated public metadata. Never copy arbitrary remote repository fields.
export const CURATED_PROJECT_MANIFEST: ReadonlyArray<CuratedProject> = [
  {
    id: 1419669309,
    name: "spoor",
    full_name: "Voldigoade/spoor",
    description:
      "Outil CLI en Rust pour inspecter l'empreinte publique d'un compte GitHub.",
    language: "Rust",
    topics: ["cli", "github", "osint", "privacy", "rust"],
    html_url: "https://github.com/Voldigoade/spoor",
    homepage: null,
  },
  {
    id: 1418158504,
    name: "recherche-messageries",
    full_name: "Voldigoade/recherche-messageries",
    description:
      "Étude comparative de messageries sécurisées selon les modèles de menaces, métadonnées et preuves documentées.",
    language: "Python",
    topics: [
      "privacy",
      "secure-messaging",
      "threat-modeling",
      "mkdocs",
      "english",
      "french",
    ],
    html_url: "https://github.com/Voldigoade/recherche-messageries",
    homepage: "https://voldigoade.github.io/recherche-messageries/",
  },
  {
    id: 1421132812,
    name: "ide-research",
    full_name: "Voldigoade/ide-research",
    description:
      "Étude comparative des environnements de développement et IDE selon les flux de travail, la sécurité et les licences.",
    language: "Python",
    topics: [
      "developer-tools",
      "ide",
      "research",
      "comparison",
      "remote-development",
    ],
    html_url: "https://github.com/Voldigoade/ide-research",
    homepage: "https://voldigoade.github.io/ide-research/",
  },
  {
    id: 1424431996,
    name: "crukst",
    full_name: "Voldigoade/crukst",
    description:
      "Prototype et fondation en Rust pour le tri et la comparaison sémantique de firmwares.",
    language: "Rust",
    topics: [
      "rust",
      "firmware",
      "diff",
      "firmware-analysis",
      "reverse-engineering",
    ],
    html_url: "https://github.com/Voldigoade/crukst",
    homepage: null,
  },
];

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
function count(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : undefined;
}
async function fetchJson(
  url: string,
  options: RequestInit & {
    next?: { revalidate: number; tags?: string[] };
  } = {},
): Promise<unknown> {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}
function publicOptions(tag: string) {
  return {
    // No credentials: token permissions cannot affect the public data boundary.
    headers: { Accept: "application/vnd.github+json" },
    cache: "force-cache" as const,
    next: { revalidate: GITHUB_CACHE_REVALIDATE_SECONDS, tags: [tag] },
  };
}
export async function getGithubRepos(
  _userOverride?: string,
): Promise<GithubRepo[]> {
  const payload = await fetchJson(
    `https://api.github.com/users/${DEFAULT_GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`,
    publicOptions("github-public-projects"),
  );
  const entries = Array.isArray(payload)
    ? payload.map(record).filter((item) => item !== null)
    : [];
  return CURATED_PROJECT_MANIFEST.map((project) => {
    const candidates = entries.filter((repo) => repo.name === project.name);
    // Reject ambiguous, private, moved, forked, archived or malformed objects.
    const repo = candidates.length === 1 ? candidates[0] : undefined;
    if (
      repo?.private !== false ||
      repo.archived !== false ||
      repo.fork !== false ||
      record(repo.owner)?.login !== DEFAULT_GITHUB_USER ||
      repo.full_name !== project.full_name ||
      repo.html_url !== project.html_url
    ) {
      return { ...project, topics: [...project.topics] };
    }
    const date =
      typeof repo.updated_at === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(repo.updated_at) &&
      Number.isFinite(Date.parse(repo.updated_at)) &&
      new Date(repo.updated_at).toISOString().replace(".000Z", "Z") ===
        repo.updated_at
        ? repo.updated_at
        : undefined;
    return {
      ...project,
      topics: [...project.topics],
      stargazers_count: count(repo.stargazers_count),
      forks_count: count(repo.forks_count),
      watchers_count: count(repo.watchers_count),
      updated_at: date,
    };
  });
}
export async function getGithubOverview(
  _githubUser?: string,
): Promise<GitHubOverviewPayload | null> {
  const repos = await getGithubRepos();
  const payload = record(
    await fetchJson(
      `https://api.github.com/users/${DEFAULT_GITHUB_USER}`,
      publicOptions("github-public-profile"),
    ),
  );
  const profile = payload?.login === DEFAULT_GITHUB_USER ? payload : null;
  const total = (key: "stargazers_count" | "forks_count" | "watchers_count") =>
    repos.every((repo) => repo[key] !== undefined)
      ? repos.reduce((sum, repo) => sum + (repo[key] ?? 0), 0)
      : null;
  const languageMap = new Map<string, number>();
  for (const repo of repos)
    if (repo.language)
      languageMap.set(repo.language, (languageMap.get(repo.language) ?? 0) + 1);
  return {
    username: DEFAULT_GITHUB_USER,
    followers: count(profile?.followers) ?? null,
    following: count(profile?.following) ?? null,
    publicRepos: count(profile?.public_repos) ?? null,
    totalRepositories: repos.length,
    projects: repos.map(({ name, html_url, language }) => ({
      name,
      url: html_url,
      language,
    })),
    totalStars: total("stargazers_count"),
    totalForks: total("forks_count"),
    totalWatchers: total("watchers_count"),
    topRepositories: repos
      .flatMap((repo) =>
        repo.stargazers_count === undefined
          ? []
          : [{ name: repo.name, stars: repo.stargazers_count }],
      )
      .sort((a, b) => b.stars - a.stars),
    languages: [...languageMap].map(([language, repos]) => ({
      language,
      repos,
    })),
    // Authenticated contribution calendars can contain private activity. Never request them.
    monthlyActivity: [],
    updateDates: [],
    commitHistory: [],
  };
}
export async function getBlogPosts(
  locale: WritingLocale = "fr",
): Promise<BlogPost[]> {
  return getBlogPostsForListing(locale);
}
