import { expect, test } from "bun:test";
import { generateStaticParams as generateFrStaticParams } from "../src/app/(fr)/blog/[slug]/page";
import { generateStaticParams as generateEnStaticParams } from "../src/app/en/blog/[slug]/page";
import {
  getAllArticles,
  getArticleBySlug,
  getPublishedArticles,
} from "../src/lib/blog";
import { withWritingFiles } from "./helpers/writing";

function source(draft: boolean) {
  return `---\ntitle: Route fixture\nsummary: Controlled route fixture\ncategory: Notes\ntags: [testing]\npublishedAt: "2026-10-18"\ndraft: ${draft}\n---\nFixture body`;
}

test("static params track published content while excluding real drafts", async () => {
  const published = await getPublishedArticles("fr");
  const all = await getAllArticles({ locale: "fr", includeDrafts: true });
  const params = await generateFrStaticParams();
  for (const draft of all.filter((article) => article.draft)) {
    expect(params.some(({ slug }) => slug === draft.slug)).toBe(false);
  }
  if (published.length > 0) {
    expect(params).toEqual(published.map(({ slug }) => ({ slug })));
  } else {
    for (const { slug } of params)
      expect(await getArticleBySlug(slug, "fr")).toBeNull();
  }
});

test("a controlled empty public collection supplies no article routes", async () => {
  await withWritingFiles({ "route-draft.md": source(true) }, async () => {
    const params = await generateFrStaticParams();
    expect(params).toEqual([]);
    expect(params.some(({ slug }) => slug === "route-draft")).toBe(false);
    for (const { slug } of params)
      expect(await getArticleBySlug(slug, "fr")).toBeNull();
  });
});

test("a controlled published collection supplies real routes without a sentinel or draft", async () => {
  await withWritingFiles(
    {
      "route-published.md": source(false),
      "route-draft.md": source(true),
    },
    async () => {
      expect(await generateFrStaticParams()).toEqual([
        { slug: "route-published" },
      ]);
      expect(await getArticleBySlug("route-published", "fr")).toMatchObject({
        slug: "route-published",
        draft: false,
      });
      expect(await getArticleBySlug("route-draft", "fr")).toBeNull();
    },
  );
});

test("English article route supplies static params for published English articles", async () => {
  await withWritingFiles(
    {
      "en/english-published.md": source(false),
      "en/english-draft.md": source(true),
    },
    async () => {
      expect(await generateEnStaticParams()).toEqual([
        { slug: "english-published" },
      ]);
      expect(await getArticleBySlug("english-published", "en")).toMatchObject({
        slug: "english-published",
        draft: false,
      });
      expect(await getArticleBySlug("english-draft", "en")).toBeNull();
    },
  );
});
