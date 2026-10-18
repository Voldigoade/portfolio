import "server-only";
import { getBlogPostsForListing } from "@/lib/blog";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  HackatimePayload,
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
    description: "Terminal-first GitHub public-footprint inspection tool.",
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
      "Independent research comparing secure messaging apps: Signal, SimpleX, Session, Olvid, Threema, Briar and more across threat models, metadata, and evidence.",
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
      "Source-driven comparison of IDEs and development environments across stacks, platforms, remote workflows, AI tooling, security, privacy and licensing.",
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
      "Early design and implementation work toward semantic firmware comparison and triage in Rust.",
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
function seconds(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
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
export async function getBlogPosts(): Promise<BlogPost[]> {
  return getBlogPostsForListing();
}
export async function getHackatimeStats(): Promise<HackatimePayload | null> {
  const provider =
    process.env.CODING_STATS_PROVIDER === "hackatime"
      ? "hackatime"
      : "wakatime";
  const apiKey =
    provider === "hackatime"
      ? process.env.HACKATIME_API_KEY
      : (process.env.WAKATIME_ACCESS_TOKEN ?? process.env.WAKATIME_API_KEY);
  if (!apiKey) return null;
  const baseUrl =
    provider === "hackatime"
      ? (
          process.env.HACKATIME_API_BASE_URL ?? "https://hackatime.hackclub.com"
        ).replace(/\/$/, "")
      : "https://api.wakatime.com";
  const prefix = provider === "hackatime" ? "/api/hackatime/v1" : "/api/v1";
  const options = {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "force-cache" as const,
    next: { revalidate: 1800, tags: ["coding-time"] },
  };
  const weeklyPayload = await fetchJson(
    `${baseUrl}${prefix}/users/current/stats/last_7_days`,
    options,
  );
  const weekly = record(record(weeklyPayload)?.data);
  if (
    !weekly ||
    typeof weekly.start !== "string" ||
    typeof weekly.end !== "string" ||
    !Array.isArray(weekly.languages)
  )
    return null;
  const startDate = weekly.start.slice(0, 10);
  const endDate = weekly.end.slice(0, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
    !Number.isFinite(Date.parse(startDate)) ||
    !Number.isFinite(Date.parse(endDate))
  )
    return null;
  // Match the provider's calendar, including its timezone, instead of inventing zero-filled heartbeats.
  const [summaryPayload, totalPayload, todayPayload] = await Promise.all([
    fetchJson(
      `${baseUrl}${prefix}/users/current/summaries?start=${startDate}&end=${endDate}`,
      options,
    ),
    provider === "wakatime"
      ? fetchJson(
          `${baseUrl}${prefix}/users/current/all_time_since_today`,
          options,
        )
      : Promise.resolve(null),
    fetchJson(
      `${baseUrl}${prefix}/users/current/${provider === "hackatime" ? "statusbar" : "status_bar"}/today`,
      options,
    ),
  ]);
  const days = record(summaryPayload)?.data;
  const allTime = record(record(totalPayload)?.data);
  const today = record(record(record(todayPayload)?.data)?.grand_total);
  const totalSeconds = seconds(allTime?.total_seconds);
  const todaySeconds = seconds(today?.total_seconds);
  const weeklySeconds = seconds(weekly.total_seconds);
  const dailyAverageSeconds = seconds(weekly.daily_average);
  // Incomplete provider responses are unavailable, never synthetic zero activity.
  if (
    todaySeconds === undefined ||
    weeklySeconds === undefined ||
    dailyAverageSeconds === undefined ||
    !Array.isArray(days)
  )
    return null;
  const last7Days: HackatimePayload["last7Days"] = [];
  for (const value of days) {
    const day = record(value);
    const duration = seconds(record(day?.grand_total)?.total_seconds);
    const date = record(day?.range)?.date;
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      duration === undefined
    )
      return null;
    last7Days.push({
      day: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      }),
      hours: duration / 3600,
    });
  }
  // A partial day list cannot truthfully imply zero activity on missing days.
  if (last7Days.length !== 7) return null;
  const languages: HackatimePayload["topLanguages"] = [];
  for (const value of weekly.languages) {
    const language = record(value);
    const duration = seconds(language?.total_seconds);
    if (typeof language?.name !== "string" || duration === undefined)
      return null;
    languages.push({ name: language.name, hours: duration / 3600 });
  }
  return {
    totalHours:
      totalSeconds === undefined
        ? null
        : `${(totalSeconds / 3600).toFixed(1)}h`,
    last7DaysTotalHours: `${(weeklySeconds / 3600).toFixed(1)}h`,
    dailyAverage: `${(dailyAverageSeconds / 3600).toFixed(2)} h/day`,
    dailyAverageHours: dailyAverageSeconds / 3600,
    todayHours: `${(todaySeconds / 3600).toFixed(1)}h today`,
    todaySeconds,
    activeDaysLast7: last7Days.filter((day) => day.hours > 0).length,
    topLanguages: languages.slice(0, 5),
    last7Days,
    hasActivity: weeklySeconds > 0,
  };
}
