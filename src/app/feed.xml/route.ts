import { getPublishedArticles } from "@/lib/blog";
import { siteName, siteUrl } from "@/lib/site-config";
import { escapeXml } from "@/lib/writing-xml";

export async function GET() {
  const articles = await getPublishedArticles("fr");
  const updated = articles.length
    ? new Date(
        Math.max(
          ...articles.map((article) =>
            Date.parse(article.updatedAt || article.publishedAt),
          ),
        ),
      ).toISOString()
    : new Date().toISOString();
  const entries = articles
    .map((article) => {
      const url = `${siteUrl}/blog/${article.slug}`;
      return `  <entry>
    <id>${escapeXml(url)}</id>
    <title>${escapeXml(article.title)}</title>
    <link href="${escapeXml(url)}"/>
    <summary type="text">${escapeXml(article.summary)}</summary>
    <published>${new Date(article.publishedAt).toISOString()}</published>
    <updated>${new Date(article.updatedAt || article.publishedAt).toISOString()}</updated>
    ${article.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join("\n    ")}
  </entry>`;
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${siteUrl}/blog</id>
  <title>${escapeXml(siteName)} - Publications</title>
  <link href="${siteUrl}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}/blog"/>
  <author><name>${escapeXml(siteName)}</name><uri>${siteUrl}</uri></author>
  <updated>${updated}</updated>
${entries}
</feed>`,
    {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
