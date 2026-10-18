import "server-only";
import { cacheLife } from "next/cache";
import { getBlogPostsForListing } from "@/lib/blog";
import type {
  BlogPost,
  GitHubOverviewPayload,
  GithubRepo,
  HackatimePayload,
} from "@/lib/portfolio-types";

interface GitHubUserResponse {
  login?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
}

interface GitHubContributionsResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: Array<{
            contributionDays?: Array<{
              date: string;
              contributionCount: number;
            }>;
          }>;
        };
      };
    };
  };
}

interface HackatimeStatsResponse {
  data?: {
    username?: string;
    human_readable_daily_average_including_other_language?: string;
    human_readable_total_including_other_language?: string;
    human_readable_total?: string;
    human_readable_daily_average?: string;
    daily_average?: number;
    languages?: Array<{ name: string; total_seconds: number }>;
    days?: Array<{
      date: string;
      grand_total: {
        total_seconds: number;
      };
    }>;
    total_seconds?: number;
  };
}

interface WakaTimeAllTimeResponse {
  data?: {
    total_seconds?: number;
    text?: string;
  };
}

interface WakaTimeTodayResponse {
  data?: {
    grand_total?: {
      total_seconds?: number;
      text?: string;
    };
  };
}

interface HackatimeClubStatsResponse {
  data?: {
    grand_total?: {
      total_seconds?: number;
      text?: string;
    };
    total_seconds?: number;
    human_readable_total?: string;
    text?: string;
  };
}

async function safeJsonParse<T>(response: Response): Promise<T | null> {
  try {
    const text = await response.text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export const DEFAULT_GITHUB_USER = "Voldigoade";
const GITHUB_CACHE_REVALIDATE_SECONDS = 60 * 60 * 12;

export interface CuratedProject {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  topics: string[];
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export const CURATED_PROJECT_MANIFEST: CuratedProject[] = [
  {
    id: 101,
    name: "spoor",
    full_name: "Voldigoade/spoor",
    description:
      "Terminal-first GitHub public-footprint inspection tool in Rust with HTTP/SSE API, structured reports and exports.",
    language: "Rust",
    topics: ["rust", "cli", "github", "osint", "security", "http-sse"],
    html_url: "https://github.com/Voldigoade/spoor",
    homepage: "https://voldigoade.xyz/#spoor",
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    updated_at: "2026-10-16T12:00:00Z",
    fork: false,
    archived: false,
    private: false,
  },
  {
    id: 102,
    name: "recherche-messageries",
    full_name: "Voldigoade/recherche-messageries",
    description:
      "Independent research comparing secure messaging apps: Signal, SimpleX, Session, Olvid, Threema, Briar and more across threat models, metadata, and evidence.",
    language: "Python",
    topics: [
      "privacy",
      "security",
      "messaging",
      "metadata",
      "threat-models",
      "research",
    ],
    html_url: "https://github.com/Voldigoade/recherche-messageries",
    homepage: "https://voldigoade.github.io/recherche-messageries/",
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    updated_at: "2026-10-15T12:00:00Z",
    fork: false,
    archived: false,
    private: false,
  },
  {
    id: 103,
    name: "ide-research",
    full_name: "Voldigoade/ide-research",
    description:
      "Source-driven comparison of IDEs and development environments across stacks, platforms, remote workflows, AI tooling, security, privacy and licensing.",
    language: "Python",
    topics: ["developer-tools", "ide", "research", "privacy", "tooling"],
    html_url: "https://github.com/Voldigoade/ide-research",
    homepage: "https://voldigoade.github.io/ide-research/",
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    updated_at: "2026-10-16T12:00:00Z",
    fork: false,
    archived: false,
    private: false,
  },
  {
    id: 104,
    name: "crukst",
    full_name: "Voldigoade/crukst",
    description: "Semantic firmware diff and triage, built in Rust.",
    language: "Rust",
    topics: ["rust", "firmware", "diff", "triage", "systems"],
    html_url: "https://github.com/Voldigoade/crukst",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    updated_at: "2026-10-18T17:00:00Z",
    fork: false,
    archived: false,
    private: false,
  },
  {
    id: 105,
    name: "diskboot",
    full_name: "Voldigoade/diskboot",
    description: "Experimental USB boot and system recovery utilities.",
    language: "Shell",
    topics: ["linux", "boot", "usb", "systems", "utilities"],
    html_url: "https://github.com/Voldigoade/diskboot",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    updated_at: "2026-10-16T12:00:00Z",
    fork: false,
    archived: true,
    private: false,
  },
];

async function getCurrentTimestamp() {
  "use cache";
  cacheLife("hours");
  return Date.now();
}

function getGithubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function toHours(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, value / 3600);
}

export async function getGithubRepos(
  _userOverride?: string,
): Promise<GithubRepo[]> {
  const username = DEFAULT_GITHUB_USER;
  const headers = getGithubHeaders();

  try {
    const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`;

    const response = await fetch(endpoint, {
      headers,
      cache: "force-cache",
      next: {
        revalidate: GITHUB_CACHE_REVALIDATE_SECONDS,
        tags: [`github-repos-${username}`],
      },
    });

    if (!response.ok) {
      return CURATED_PROJECT_MANIFEST;
    }

    const fetchedRepos = await safeJsonParse<GithubRepo[]>(response);
    if (!fetchedRepos || !Array.isArray(fetchedRepos)) {
      return CURATED_PROJECT_MANIFEST;
    }

    // Defensive security filter: strictly exclude any private repositories
    const publicRepos = fetchedRepos.filter(
      (repo) => repo.private !== true && !repo.name.startsWith("."),
    );

    // Filter against curated manifest allowlist
    const manifestMap = new Map(
      CURATED_PROJECT_MANIFEST.map((m) => [m.name.toLowerCase(), m]),
    );
    const matchedRepos: GithubRepo[] = [];

    for (const repo of publicRepos) {
      const match = manifestMap.get(repo.name.toLowerCase());
      if (match) {
        matchedRepos.push({
          ...match,
          ...repo,
          id: repo.id || match.id,
          description: repo.description?.trim() || match.description,
          topics: Array.from(
            new Set([...(repo.topics ?? []), ...match.topics]),
          ),
          language: repo.language || match.language,
          homepage: repo.homepage || match.homepage,
          private: false,
        });
        manifestMap.delete(repo.name.toLowerCase());
      }
    }

    // Include remaining curated projects
    for (const remaining of manifestMap.values()) {
      matchedRepos.push(remaining);
    }

    return matchedRepos;
  } catch {
    return CURATED_PROJECT_MANIFEST;
  }
}

export async function getGithubOverview(
  _githubUser?: string,
): Promise<GitHubOverviewPayload | null> {
  const username = DEFAULT_GITHUB_USER;
  const repos = await getGithubRepos();
  if (repos.length === 0) {
    return null;
  }

  const headers = getGithubHeaders();

  // Strictly use public endpoint: never call /user
  const userResponse = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    cache: "force-cache",
    next: {
      revalidate: GITHUB_CACHE_REVALIDATE_SECONDS,
      tags: [`github-profile-${username}`],
    },
  }).catch(() => null);

  const profile = userResponse?.ok
    ? ((await safeJsonParse<GitHubUserResponse>(userResponse)) ?? {})
    : {};

  const responseDateHeader = userResponse?.headers.get("date");
  const referenceDate = new Date(
    responseDateHeader ?? repos[0]?.updated_at ?? "1970-01-01T00:00:00Z",
  );
  const rangeEndDate = Number.isNaN(referenceDate.getTime())
    ? new Date("1970-01-01T00:00:00Z")
    : new Date(referenceDate);
  const commitYear = rangeEndDate.getUTCFullYear();
  rangeEndDate.setUTCHours(23, 59, 59, 999);
  const rangeStartDate = new Date(rangeEndDate);
  rangeStartDate.setUTCDate(rangeStartDate.getUTCDate() - 364);
  rangeStartDate.setUTCHours(0, 0, 0, 0);
  const rangeStart = rangeStartDate.toISOString();
  const rangeEnd = rangeEndDate.toISOString();
  let commitHistory: Array<{ date: string; commits: number }> = [];

  // Focus stats/charts on active owned projects.
  const projectRepos = repos.filter((repo) => !repo.fork && !repo.archived);

  // Use GraphQL contribution calendar when token is available
  if (process.env.GITHUB_TOKEN) {
    const contributionResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          login: username,
          from: rangeStart,
          to: rangeEnd,
        },
      }),
      cache: "force-cache",
      next: {
        revalidate: GITHUB_CACHE_REVALIDATE_SECONDS,
        tags: [`github-contributions-${username}-${commitYear}`],
      },
    }).catch(() => null);

    if (contributionResponse?.ok) {
      const payload =
        await safeJsonParse<GitHubContributionsResponse>(contributionResponse);

      const days =
        payload?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
          ?.flatMap((week) => week.contributionDays ?? [])
          .filter((day) => typeof day.date === "string") ?? [];

      commitHistory = days.map((day) => ({
        date: day.date,
        commits: day.contributionCount,
      }));
    }
  }

  const totalStars = projectRepos.reduce(
    (sum, repo) => sum + (repo.stargazers_count ?? 0),
    0,
  );
  const totalForks = projectRepos.reduce(
    (sum, repo) => sum + (repo.forks_count ?? 0),
    0,
  );
  const totalWatchers = projectRepos.reduce(
    (sum, repo) => sum + (repo.watchers_count ?? 0),
    0,
  );

  const topRepositories = [...projectRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 7)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
    }));

  const languageMap = new Map<string, number>();
  for (const repo of projectRepos) {
    const language = repo.language?.trim();
    if (!language) {
      continue;
    }

    const value = languageMap.get(language) ?? 0;
    languageMap.set(language, value + 1);
  }

  const languages = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([language, count]) => ({
      language,
      repos: count,
    }));

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyMap = new Map<string, number>();

  for (const day of commitHistory) {
    const date = new Date(day.date);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const month = monthOrder[date.getUTCMonth()] ?? "Unknown";
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + day.commits);
  }

  const monthlyActivity = monthOrder
    .filter((month) => monthlyMap.has(month))
    .map((month) => ({
      month,
      repos: monthlyMap.get(month) ?? 0,
    }));

  const updateDates = commitHistory.flatMap((entry) =>
    Array.from({ length: Math.max(0, entry.commits) }, () => entry.date),
  );

  // Only public repos are counted
  const publicRepoCount = profile.public_repos ?? projectRepos.length;
  const totalRepositories = projectRepos.length;

  return {
    username: profile.login ?? username,
    commitYear,
    commitRangeStart: rangeStart,
    commitRangeEnd: rangeEnd,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    publicRepos: publicRepoCount,
    totalRepositories,
    totalStars,
    totalForks,
    totalWatchers,
    topRepositories,
    languages,
    monthlyActivity,
    updateDates,
    commitHistory,
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
      : process.env.WAKATIME_API_KEY;

  if (!apiKey) return null;

  const baseUrl =
    provider === "wakatime"
      ? "https://wakatime.com"
      : (
          process.env.HACKATIME_API_BASE_URL ?? "https://hackatime.hackclub.com"
        ).replace(/\/$/, "");

  const sevenDayUrl =
    provider === "wakatime"
      ? `${baseUrl}/api/v1/users/current/stats/last_7_days?api_key=${apiKey}`
      : `${baseUrl}/api/hackatime/v1/users/current/stats/last_7_days?api_key=${apiKey}`;

  const allTimeUrl =
    provider === "wakatime"
      ? `${baseUrl}/api/v1/users/current/all_time_since_today?api_key=${apiKey}`
      : `${baseUrl}/api/hackatime/v1/users/current/all_time_since_today?api_key=${apiKey}`;

  const todayStatusUrl =
    provider === "wakatime"
      ? `${baseUrl}/api/v1/users/current/statusbar/today?api_key=${apiKey}`
      : `${baseUrl}/api/hackatime/v1/users/current/statusbar/today?api_key=${apiKey}`;

  const [sevenDayResponse, allTimeResponse, todayStatusResponse] =
    await Promise.all([
      fetch(sevenDayUrl, {
        cache: "force-cache",
        next: {
          revalidate: 1800,
          tags: ["coding-time", "coding-time-seven-days"],
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }),
      fetch(allTimeUrl, {
        cache: "force-cache",
        next: {
          revalidate: 1800,
          tags: ["coding-time", "coding-time-total"],
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }).catch(() => null),
      fetch(todayStatusUrl, {
        cache: "force-cache",
        next: {
          revalidate: 300,
          tags: ["coding-time", "coding-time-today"],
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }).catch(() => null),
    ]);

  if (!sevenDayResponse.ok) {
    return null;
  }

  const sevenDay =
    await safeJsonParse<HackatimeStatsResponse>(sevenDayResponse);

  if (!sevenDay) {
    return null;
  }

  const allTime = allTimeResponse?.ok
    ? ((await safeJsonParse<WakaTimeAllTimeResponse>(allTimeResponse)) ?? {
        data: { total_seconds: undefined },
      })
    : { data: { total_seconds: undefined } };

  const todayStatus = todayStatusResponse?.ok
    ? ((await safeJsonParse<WakaTimeTodayResponse>(todayStatusResponse)) ?? {
        data: {
          grand_total: {
            total_seconds: 0,
            text: "0h today",
          },
        },
      })
    : {
        data: {
          grand_total: {
            total_seconds: 0,
            text: "0h today",
          },
        },
      };

  const daysFromStats = (sevenDay.data?.days ?? []).map((day) => ({
    day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
    hours: Number(toHours(day.grand_total?.total_seconds ?? 0).toFixed(2)),
  }));

  const hackatimeLast7Days = await (async () => {
    const now = new Date(await getCurrentTimestamp());
    const requests = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setUTCDate(date.getUTCDate() - (6 - index));

      return fetch(
        `${baseUrl}/api/v1/users/current/heartbeats?date=${date.toISOString().slice(0, 10)}&api_key=${apiKey}`,
        {
          cache: "force-cache",
          next: {
            revalidate: 1800,
            tags: ["coding-time", "coding-time-heartbeats"],
          },
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )
        .then(async (response) => {
          if (!response.ok) {
            return {
              day: date.toLocaleDateString("en-US", { weekday: "short" }),
              hours: 0,
            };
          }

          const payload = (await response.json()) as {
            data?: Array<{
              duration?: number;
            }>;
          };

          const durationSeconds =
            payload.data?.reduce(
              (acc, curr) => acc + (curr.duration ?? 0),
              0,
            ) ?? 0;

          return {
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            hours: Number(toHours(durationSeconds).toFixed(2)),
          };
        })
        .catch(() => ({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          hours: 0,
        }));
    });

    return Promise.all(requests);
  })();

  const last7Days =
    daysFromStats.length > 0 ? daysFromStats : hackatimeLast7Days;

  const topLanguages = (sevenDay.data?.languages ?? [])
    .slice(0, 5)
    .map((lang) => ({
      name: lang.name,
      hours: Number(toHours(lang.total_seconds).toFixed(1)),
    }));

  const last7DaysTotalSeconds = Math.round(
    last7Days.reduce((sum, day) => sum + day.hours * 3600, 0),
  );
  const last7DaysTotalHours = `${toHours(last7DaysTotalSeconds).toFixed(1)}h`;

  let totalSeconds =
    sevenDay.data?.total_seconds ??
    allTime.data?.total_seconds ??
    last7DaysTotalSeconds;
  let totalHours = `${toHours(totalSeconds).toFixed(1)}h`;

  const hackatimeUsername =
    sevenDay.data?.username?.trim() ||
    process.env.HACKATIME_USERNAME ||
    DEFAULT_GITHUB_USER;

  if (hackatimeUsername && provider === "hackatime") {
    const allTimeHackclubResponse = await fetch(
      `${baseUrl}/api/v1/users/${encodeURIComponent(hackatimeUsername)}/stats?api_key=${apiKey}`,
      {
        cache: "force-cache",
        next: {
          revalidate: 1800,
          tags: ["coding-time", "coding-time-hackclub-total"],
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    ).catch(() => null);

    if (allTimeHackclubResponse?.ok) {
      const allTimeHackclubPayload =
        await safeJsonParse<HackatimeClubStatsResponse>(
          allTimeHackclubResponse,
        );

      if (allTimeHackclubPayload) {
        const allTimeHackclubSeconds =
          allTimeHackclubPayload.data?.grand_total?.total_seconds ??
          allTimeHackclubPayload.data?.total_seconds ??
          totalSeconds;
        totalSeconds = allTimeHackclubSeconds;
        totalHours =
          allTimeHackclubPayload.data?.human_readable_total ??
          allTimeHackclubPayload.data?.grand_total?.text ??
          allTimeHackclubPayload.data?.text ??
          `${toHours(allTimeHackclubSeconds).toFixed(1)}h`;
      }
    }
  }

  const hasActivity =
    last7Days.some((day) => day.hours > 0) ||
    topLanguages.some((language) => language.hours > 0);

  const dailyAverageHours = Number(
    toHours(sevenDay.data?.daily_average ?? 0).toFixed(2),
  );
  const activeDaysLast7 = last7Days.filter((day) => day.hours > 0).length;
  const todaySeconds = todayStatus.data?.grand_total?.total_seconds ?? 0;
  const todayHours =
    todayStatus.data?.grand_total?.text ??
    `${toHours(todaySeconds).toFixed(1)}h today`;

  return {
    totalHours,
    last7DaysTotalHours,
    dailyAverage:
      sevenDay.data?.human_readable_daily_average_including_other_language ??
      sevenDay.data?.human_readable_daily_average ??
      `${toHours(sevenDay.data?.daily_average ?? 0).toFixed(2)} h/day`,
    dailyAverageHours,
    todayHours,
    todaySeconds,
    activeDaysLast7,
    topLanguages,
    last7Days,
    hasActivity,
  };
}
