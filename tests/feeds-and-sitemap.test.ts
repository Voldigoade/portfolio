import { describe, expect, it, spyOn } from "bun:test";
import fs from "node:fs/promises";
import Parser from "rss-parser";
import { GET as getRssEn } from "../src/app/en/rss.xml/route";
import { GET as getAtom } from "../src/app/feed.xml/route";
import { GET as getRssFr } from "../src/app/rss.xml/route";
import sitemap from "../src/app/sitemap";
import { withWritingFiles } from "./helpers/writing";

function source(draft: boolean) {
  return `---\ntitle: 'Fixture <title> & "quotes"'\nsummary: 'A & B <summary>'\ncategory: Systèmes\ntags: ['A&B', '<tag>']\npublishedAt: "2026-10-18"\ndraft: ${draft}\n---\nFixture body`;
}

describe("public writing XML", () => {
  it("serves valid empty RSS, Atom and sitemap for a controlled draft-only collection", async () => {
    await withWritingFiles(
      { "internal-fixture.md": source(true) },
      async () => {
        const rss = await getRssFr();
        const atom = await getAtom();
        const rssXml = await rss.text();
        const atomXml = await atom.text();
        expect(rss.status).toBe(200);
        expect(atom.status).toBe(200);
        expect(rss.headers.get("Content-Type")).toContain("xml");
        expect(atom.headers.get("Content-Type")).toContain("xml");
        expect(rssXml).toContain('<rss version="2.0"');
        expect(rssXml).not.toContain("<item>");
        expect(atomXml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
        expect(atomXml).not.toContain("<entry>");
        expect(atomXml).toContain("<updated>");
        for (const xml of [rssXml, atomXml]) {
          expect(xml).not.toContain("internal-fixture");
          expect((await new Parser().parseString(xml)).items).toEqual([]);
        }
        const entries = await sitemap();
        expect(entries.map((entry) => entry.url)).toContain(
          "https://voldigoade.xyz/blog",
        );
        expect(entries.some((entry) => entry.url.includes("/blog/"))).toBe(
          false,
        );
        expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
          true,
        );
      },
    );
  });

  it("includes published fixtures with escaped XML and real dates, excluding drafts", async () => {
    await withWritingFiles(
      {
        "published-fixture.md": source(false),
        "internal-fixture.md": source(true),
      },
      async () => {
        const rss = await (await getRssFr()).text();
        const atom = await (await getAtom()).text();
        for (const xml of [rss, atom]) {
          expect(xml).toContain(
            "https://voldigoade.xyz/blog/published-fixture",
          );
          expect(xml).toContain(
            "Fixture &lt;title&gt; &amp; &quot;quotes&quot;",
          );
          expect(xml).toContain("A &amp; B &lt;summary&gt;");
          expect(xml).not.toContain("internal-fixture");
          expect(xml).not.toContain("<summary>");
          const parsed = await new Parser().parseString(xml);
          expect(parsed.items).toHaveLength(1);
          expect(parsed.items[0]?.title).toBe('Fixture <title> & "quotes"');
        }
        expect(rss).toContain(
          "<pubDate>Sun, 18 Oct 2026 00:00:00 GMT</pubDate>",
        );
        expect(atom).toContain(
          "<published>2026-10-18T00:00:00.000Z</published>",
        );
        const entries = await sitemap();
        expect(entries).toContainEqual(
          expect.objectContaining({
            url: "https://voldigoade.xyz/blog/published-fixture",
            lastModified: "2026-10-18T00:00:00.000Z",
          }),
        );
        expect(
          entries.some((entry) => entry.url.includes("internal-fixture")),
        ).toBe(false);
      },
    );
  });

  it("serves English RSS feed correctly for English articles", async () => {
    await withWritingFiles(
      {
        "en/english-fixture.md": `---\ntitle: 'English Post'\nsummary: 'English summary'\ncategory: Systems\ntags: ['systems']\npublishedAt: '2026-10-18'\ndraft: false\n---\nBody`,
      },
      async () => {
        const rss = await getRssEn();
        expect(rss.status).toBe(200);
        const xml = await rss.text();
        expect(xml).toContain("<language>en-us</language>");
        expect(xml).toContain("https://voldigoade.xyz/en/blog/english-fixture");
        expect(xml).toContain("English Post");
      },
    );
  });

  it("returns valid empty feeds when the writing directory is missing", async () => {
    const list = spyOn(fs, "readdir").mockRejectedValue(
      Object.assign(new Error("Missing"), { code: "ENOENT" }),
    );
    try {
      expect(await (await getRssFr()).text()).not.toContain("<item>");
      const xml = await (await getAtom()).text();
      expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
      expect(xml).not.toContain("<entry>");
    } finally {
      list.mockRestore();
    }
  });
});
