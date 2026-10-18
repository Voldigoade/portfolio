import { expect, test } from "bun:test";
import { generateStaticParams } from "../src/app/blog/[slug]/page";
import {
  getAllArticles,
  getArticleBySlug,
  getPublishedArticles,
} from "../src/lib/blog";
import { withWritingFiles } from "./helpers/writing";

function source(slug: string, draft: boolean) {
  return `---\ntitle: Route fixture\nslug: ${slug}\nsummary: Controlled route fixture\ntype: Note\ntags: [testing]\npublishedAt: "2026-10-18"\ndraft: ${draft}\n---\nFixture body`;
}

test("static params track published content while excluding real drafts", async () => {
  const published = await getPublishedArticles();
  const all = await getAllArticles({ includeDrafts: true });
  const params = await generateStaticParams();
  for (const draft of all.filter((article) => article.draft)) {
    expect(params.some(({ slug }) => slug === draft.slug)).toBe(false);
  }
  if (published.length > 0) {
    expect(params).toEqual(published.map(({ slug }) => ({ slug })));
  } else {
    for (const { slug } of params)
      expect(await getArticleBySlug(slug)).toBeNull();
  }
});

test("a controlled empty public collection supplies no article routes", async () => {
  await withWritingFiles(
    { "route-draft.md": source("route-draft", true) },
    async () => {
      const params = await generateStaticParams();
      expect(params).toEqual([]);
      expect(params.some(({ slug }) => slug === "route-draft")).toBe(false);
      for (const { slug } of params)
        expect(await getArticleBySlug(slug)).toBeNull();
    },
  );
});

test("a controlled published collection supplies real routes without a sentinel or draft", async () => {
  await withWritingFiles(
    {
      "route-published.md": source("route-published", false),
      "route-draft.md": source("route-draft", true),
    },
    async () => {
      expect(await generateStaticParams()).toEqual([
        { slug: "route-published" },
      ]);
      expect(await getArticleBySlug("route-published")).toMatchObject({
        slug: "route-published",
        draft: false,
      });
      expect(await getArticleBySlug("route-draft")).toBeNull();
    },
  );
});
