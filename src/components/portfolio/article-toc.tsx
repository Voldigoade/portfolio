import type { TableOfContentsItem, WritingLocale } from "@/lib/blog";

interface ArticleTocProps {
  items?: TableOfContentsItem[];
  locale?: WritingLocale;
}

export function ArticleToc({ items, locale = "fr" }: ArticleTocProps) {
  if (!items || items.length === 0) return null;

  // Threshold: display only when there are at least 3 H2 headings
  const h2Items = items.filter((item) => item.depth === 2);
  if (h2Items.length < 3) return null;

  const title = locale === "en" ? "In this article" : "Dans cet article";
  const ariaLabel =
    locale === "en" ? "Table of contents" : "Sommaire de l'article";

  return (
    <nav
      aria-label={ariaLabel}
      className="not-prose border-4 border-black bg-card p-5 sm:p-6 shadow-retro-sm"
    >
      <p className="font-pixel text-xs sm:text-sm uppercase tracking-wide text-foreground mb-3 font-black">
        {title}
      </p>
      <ul className="space-y-2 text-sm font-medium">
        {h2Items.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <span className="text-primary font-bold select-none">•</span>
            <a
              href={`#${item.id}`}
              className="text-foreground hover:text-primary transition underline underline-offset-4 decoration-black/30 hover:decoration-primary font-medium"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
