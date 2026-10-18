import { describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));

import {
  DEFAULT_SITE_URL,
  githubUrl,
  siteHost,
  siteUrl,
} from "../src/lib/site-config";

describe("Security & Portfolio Data Isolation", () => {
  it("enforces curated project manifest allowlist", async () => {
    const { CURATED_PROJECT_MANIFEST } = await import(
      "../src/lib/server/portfolio-data"
    );
    expect(CURATED_PROJECT_MANIFEST).toHaveLength(5);
    const names = CURATED_PROJECT_MANIFEST.map((item) => item.name);
    expect(names).toContain("spoor");
    expect(names).toContain("recherche-messageries");
    expect(names).toContain("ide-research");
    expect(names).toContain("crukst");
    expect(names).toContain("diskboot");
  });

  it("never returns private repositories from getGithubRepos", async () => {
    const { CURATED_PROJECT_MANIFEST, getGithubRepos } = await import(
      "../src/lib/server/portfolio-data"
    );
    const repos = await getGithubRepos();

    // Verify all returned repos are public and in the allowlist
    const allowlist = new Set(CURATED_PROJECT_MANIFEST.map((m) => m.name));
    for (const repo of repos) {
      expect(repo.private).not.toBe(true);
      expect(allowlist.has(repo.name)).toBe(true);
    }
  });

  it("verifies site configuration integrity and Voldigoade domain", () => {
    expect(DEFAULT_SITE_URL).toBe("https://voldigoade.xyz");
    expect(siteUrl).toBe("https://voldigoade.xyz");
    expect(siteHost).toBe("voldigoade.xyz");
    expect(githubUrl).toBe("https://github.com/Voldigoade");
  });
});
