import type { NextRequest } from "next/server";
import { getArticleBySlug, type WritingLocale } from "@/lib/blog";
import { buildOgImage } from "@/lib/og-image";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const localeParam = searchParams.get("locale");
  const locale: WritingLocale = localeParam === "en" ? "en" : "fr";

  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 });
  }

  const article = await getArticleBySlug(slug, locale, {
    includeDrafts: false,
  });
  if (!article) {
    return new Response("Article not found", { status: 404 });
  }

  const eyebrow =
    locale === "en"
      ? `Voldigoade • ${article.category || "Writing"}`
      : `Voldigoade • ${article.category || "Article"}`;

  return buildOgImage({
    eyebrow,
    title: article.title,
    subtitle: article.summary,
    accent: locale === "en" ? "secondary" : "primary",
  });
}
