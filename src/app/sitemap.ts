import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/blog";
import { siteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${siteUrl}`,
          en: `${siteUrl}/en`,
        },
      },
    },
    {
      url: `${siteUrl}/en`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${siteUrl}`,
          en: `${siteUrl}/en`,
        },
      },
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${siteUrl}/about`,
          en: `${siteUrl}/en/about`,
        },
      },
    },
    {
      url: `${siteUrl}/en/about`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${siteUrl}/about`,
          en: `${siteUrl}/en/about`,
        },
      },
    },
    {
      url: `${siteUrl}/project`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${siteUrl}/project`,
          en: `${siteUrl}/en/project`,
        },
      },
    },
    {
      url: `${siteUrl}/en/project`,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${siteUrl}/project`,
          en: `${siteUrl}/en/project`,
        },
      },
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${siteUrl}/blog`,
          en: `${siteUrl}/en/blog`,
        },
      },
    },
    {
      url: `${siteUrl}/en/blog`,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${siteUrl}/blog`,
          en: `${siteUrl}/en/blog`,
        },
      },
    },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          fr: `${siteUrl}/privacy-policy`,
          en: `${siteUrl}/en/privacy-policy`,
        },
      },
    },
    {
      url: `${siteUrl}/en/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          fr: `${siteUrl}/privacy-policy`,
          en: `${siteUrl}/en/privacy-policy`,
        },
      },
    },
  ];

  try {
    const [frArticles, enArticles] = await Promise.all([
      getAllArticles({ locale: "fr", includeDrafts: false }),
      getAllArticles({ locale: "en", includeDrafts: false }),
    ]);

    const frRoutes: MetadataRoute.Sitemap = frArticles.map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: new Date(
        article.updatedAt || article.publishedAt,
      ).toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${siteUrl}/blog/${article.slug}`,
          ...(article.translationSlug
            ? { en: `${siteUrl}/en/blog/${article.translationSlug}` }
            : {}),
        },
      },
    }));

    const enRoutes: MetadataRoute.Sitemap = enArticles.map((article) => ({
      url: `${siteUrl}/en/blog/${article.slug}`,
      lastModified: new Date(
        article.updatedAt || article.publishedAt,
      ).toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${siteUrl}/en/blog/${article.slug}`,
          ...(article.translationSlug
            ? { fr: `${siteUrl}/blog/${article.translationSlug}` }
            : {}),
        },
      },
    }));

    return [...staticRoutes, ...frRoutes, ...enRoutes];
  } catch {
    return staticRoutes;
  }
}
