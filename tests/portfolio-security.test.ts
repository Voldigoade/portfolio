import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));
const { getGithubRepos, getGithubOverview } = await import(
  "../src/lib/server/portfolio-data"
);
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const publicRepo = {
  id: 9,
  name: "spoor",
  full_name: "Voldigoade/spoor",
  owner: { login: "Voldigoade" },
  private: false,
  archived: false,
  fork: false,
  description: "PUBLIC REMOTE DESCRIPTION",
  topics: ["public-topic"],
  language: "Rust",
  html_url: "https://github.com/Voldigoade/spoor",
  homepage: null,
  stargazers_count: 3,
  forks_count: 2,
  watchers_count: 4,
  updated_at: "2026-10-17T10:20:30Z",
};
function respond(payload: unknown, status = 200) {
  globalThis.fetch = mock(async () =>
    Response.json(payload, { status }),
  ) as unknown as typeof fetch;
}
function spoor(repos: Awaited<ReturnType<typeof getGithubRepos>>) {
  const repo = repos.find((repo) => repo.name === "spoor");
  if (!repo) throw new Error("Expected public spoor card");
  return repo;
}

describe("public portfolio boundary", () => {
  beforeEach(() => {
    delete process.env.GITHUB_TOKEN;
    delete process.env.WAKATIME_API_KEY;
    delete process.env.WAKATIME_ACCESS_TOKEN;
    delete process.env.HACKATIME_API_KEY;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  it("publishes only active curated public projects and enriches real metrics", async () => {
    respond([
      publicRepo,
      { ...publicRepo, name: "diskboot", archived: true },
      { ...publicRepo, name: "unlisted", description: "UNLISTED" },
    ]);
    const repos = await getGithubRepos();
    expect(repos.map((repo) => repo.name)).toEqual([
      "spoor",
      "crucksware",
      "recherche-messageries",
    ]);
    expect(spoor(repos).stargazers_count).toBe(3);
    expect(spoor(repos).updated_at).toBe("2026-10-17T10:20:30Z");
    expect(JSON.stringify(repos)).not.toContain("UNLISTED");
  });

  it("returns static curation without fake metrics on API error or invalid JSON", async () => {
    for (const payload of [{ message: "PRIVATE ERROR DETAIL" }, null]) {
      respond(payload, 503);
      const repos = await getGithubRepos();
      expect(repos).toHaveLength(3);
      for (const repo of repos) {
        expect(repo.stargazers_count).toBeUndefined();
        expect(repo.forks_count).toBeUndefined();
        expect(repo.watchers_count).toBeUndefined();
        expect(repo.updated_at).toBeUndefined();
      }
      expect(JSON.stringify(repos)).not.toContain("PRIVATE ERROR DETAIL");
    }
  });

  it("network failures and malformed arrays preserve safe static projects", async () => {
    for (const payload of [null, {}, [null, { name: 3 }, "secret"]]) {
      respond(payload);
      expect(await getGithubRepos()).toHaveLength(3);
    }
    globalThis.fetch = mock(async () => {
      throw new Error("SECRET");
    }) as unknown as typeof fetch;
    expect(JSON.stringify(await getGithubRepos())).not.toContain("SECRET");
  });

  it("private, foreign-owner, renamed, redirected, archived, fork and ambiguous responses cannot enrich public cards", async () => {
    respond([]);
    const fallback = await getGithubRepos();
    for (const changed of [
      { private: true },
      { private: undefined },
      { owner: { login: "foreign" } },
      { full_name: "foreign/spoor" },
      { html_url: "https://github.com/foreign/spoor" },
      { archived: true },
      { fork: true },
      { archived: undefined },
    ]) {
      respond([
        {
          ...publicRepo,
          ...changed,
          description: "PRIVATE SECRET",
          topics: ["SECRET"],
          homepage: "https://private.example",
        },
      ]);
      expect(await getGithubRepos()).toEqual(fallback);
    }
  });

  it("missing, negative, infinite and malformed metrics remain unavailable", async () => {
    respond([
      {
        ...publicRepo,
        stargazers_count: undefined,
        forks_count: -1,
        watchers_count: "12",
        updated_at: "invented",
      },
    ]);
    const repo = spoor(await getGithubRepos());
    expect(repo.stargazers_count).toBeUndefined();
    expect(repo.forks_count).toBeUndefined();
    expect(repo.watchers_count).toBeUndefined();
    expect(repo.updated_at).toBeUndefined();
  });

  it("rejects ambiguous duplicates and impossible remote update dates", async () => {
    respond([publicRepo, { ...publicRepo, private: true }]);
    expect(spoor(await getGithubRepos()).stargazers_count).toBeUndefined();
    respond([{ ...publicRepo, updated_at: "2026-02-31T10:20:30Z" }]);
    expect(spoor(await getGithubRepos()).updated_at).toBeUndefined();
  });

  it("public route query parameters cannot select users or expose upstream errors", async () => {
    const { GET } = await import("../src/app/api/portfolio/repos/route");
    const calls: string[] = [];
    globalThis.fetch = mock(async (input) => {
      calls.push(String(input));
      return Response.json(
        { message: "PRIVATE UPSTREAM ERROR" },
        { status: 403 },
      );
    }) as unknown as typeof fetch;
    const response: Response = await Reflect.apply(GET, undefined, [
      new Request(
        "https://voldigoade.xyz/api/portfolio/repos?user=private-owner",
      ),
    ]);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toHaveLength(3);
    expect(JSON.stringify(body)).not.toContain("PRIVATE UPSTREAM ERROR");
    expect(calls.every((url) => url.includes("/users/Voldigoade/repos?"))).toBe(
      true,
    );
  });

  it("caller overrides cannot select identity and public API requests are bounded and credential-free", async () => {
    process.env.GITHUB_TOKEN = "SECRET_TOKEN";
    const calls: Array<{ url: string; options?: RequestInit }> = [];
    globalThis.fetch = mock(async (input, options) => {
      calls.push({ url: String(input), options });
      return Response.json([publicRepo]);
    }) as unknown as typeof fetch;
    await getGithubRepos("other-user");
    expect(calls[0]?.url).toBe(
      "https://api.github.com/users/Voldigoade/repos?sort=updated&per_page=100&type=owner",
    );
    expect(calls[0]?.options?.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.stringify(calls)).not.toContain("SECRET_TOKEN");
  });

  it("overview never queries authenticated contributions or exposes profile-private aggregate counts", async () => {
    process.env.GITHUB_TOKEN = "SECRET_TOKEN";
    const calls: string[] = [];
    globalThis.fetch = mock(async (input) => {
      calls.push(String(input));
      if (String(input).includes("/repos?")) return Response.json([publicRepo]);
      return Response.json({
        login: "Voldigoade",
        followers: 12,
        following: 4,
        public_repos: 40,
        total_private_repos: 99,
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                weeks: [
                  {
                    contributionDays: [
                      { date: "2026-10-01", contributionCount: 99 },
                    ],
                  },
                ],
              },
            },
          },
        },
      });
    }) as unknown as typeof fetch;
    const result = await getGithubOverview("other-user");
    expect(calls.some((url) => url.includes("graphql"))).toBe(false);
    expect(result?.username).toBe("Voldigoade");
    expect(result?.projects.map((repo) => repo.name)).toEqual([
      "spoor",
      "crucksware",
      "recherche-messageries",
    ]);
    expect(result?.commitHistory).toEqual([]);
    expect(result?.monthlyActivity).toEqual([]);
    expect(result?.totalStars).toBeNull(); // incomplete curated metric set
    expect(JSON.stringify(result)).not.toContain("99");
  });
});
