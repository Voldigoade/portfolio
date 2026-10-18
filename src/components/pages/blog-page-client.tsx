"use client";

import { BlogGrid } from "@/components/portfolio/blog-grid";
import type { BlogPost, WritingLocale } from "@/lib/portfolio-types";

type BlogPageClientProps = {
  initialPosts: BlogPost[];
  locale?: WritingLocale;
};

export function BlogPageClient({
  initialPosts,
  locale = "fr",
}: BlogPageClientProps) {
  return <BlogGrid initialPosts={initialPosts} locale={locale} />;
}
