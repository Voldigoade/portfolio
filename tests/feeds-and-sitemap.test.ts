import { describe, expect, it } from "bun:test";
import { GET as getFeed } from "../src/app/feed.xml/route";
import { GET as getRss } from "../src/app/rss.xml/route";
import sitemap from "../src/app/sitemap";

describe("Feeds & Sitemap Privacy", () => {
  it("generates sitemap with canonical static routes and published articles", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://voldigoade.xyz");
    expect(urls).toContain("https://voldigoade.xyz/about");
    expect(urls).toContain("https://voldigoade.xyz/project");
    expect(urls).toContain("https://voldigoade.xyz/blog");
    expect(urls).toContain("https://voldigoade.xyz/contact");
    expect(urls).toContain("https://voldigoade.xyz/privacy-policy");
    expect(urls).toContain("https://voldigoade.xyz/terms-of-service");
    expect(urls).toContain("https://voldigoade.xyz/cookies-policy");

    // Must contain published article
    expect(urls).toContain(
      "https://voldigoade.xyz/blog/spoor-github-footprint-inspection",
    );

    // Must NEVER contain draft post
    expect(urls).not.toContain(
      "https://voldigoade.xyz/blog/draft-example-post",
    );
  });

  it("serves valid RSS 2.0 feed without draft posts", async () => {
    const response = await getRss();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/xml");

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<title>Voldigoade");
    expect(xml).toContain(
      "https://voldigoade.xyz/blog/spoor-github-footprint-inspection",
    );
    expect(xml).not.toContain("draft-example-post");
  });

  it("serves valid Atom feed without draft posts", async () => {
    const response = await getFeed();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/xml");

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain(
      "https://voldigoade.xyz/blog/spoor-github-footprint-inspection",
    );
    expect(xml).not.toContain("draft-example-post");
  });
});
