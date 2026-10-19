import { getPublishedArticles } from "@/lib/blog";
import { siteName, siteUrl } from "@/lib/site-config";
import { escapeXml } from "@/lib/writing-xml";

export async function GET() {
  const articles = await getPublishedArticles("fr");

  const itemsXml = articles
    .map((article) => {
      const articleUrl = `${siteUrl}/blog/${article.slug}`;
      const pubDate = new Date(article.publishedAt).toUTCString();

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      ${article.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} - Publications</title>
    <link>${siteUrl}/blog</link>
    <description>Articles techniques, retours d'expérience et notes de recherche par Voldigoade.</description>
    <language>fr</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
