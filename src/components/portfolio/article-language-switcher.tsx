import Link from "next/link";
import type { WritingLocale } from "@/lib/blog";

interface ArticleLanguageSwitcherProps {
  currentLocale: WritingLocale;
  translationSlug?: string;
}

export function ArticleLanguageSwitcher({
  currentLocale,
  translationSlug,
}: ArticleLanguageSwitcherProps) {
  const isFrench = currentLocale === "fr";
  const frUrl = isFrench
    ? null
    : translationSlug
      ? `/blog/${translationSlug}`
      : null;
  const enUrl = !isFrench
    ? null
    : translationSlug
      ? `/en/blog/${translationSlug}`
      : null;

  return (
    <nav
      className="inline-flex items-center border-2 border-black bg-card text-xs font-black uppercase shadow-retro-xs"
      aria-label={isFrench ? "Changer de langue" : "Switch language"}
    >
      {isFrench ? (
        <span className="bg-primary px-2.5 py-1 text-primary-foreground">
          FR
        </span>
      ) : frUrl ? (
        <Link
          href={frUrl}
          className="px-2.5 py-1 text-card-foreground transition hover:bg-muted"
          title="Lire la version française"
        >
          FR
        </Link>
      ) : (
        <span
          className="px-2.5 py-1 text-muted-foreground opacity-50"
          title="Pas de version française disponible"
        >
          FR
        </span>
      )}

      <span className="border-r-2 border-black h-full" />

      {!isFrench ? (
        <span className="bg-primary px-2.5 py-1 text-primary-foreground">
          EN
        </span>
      ) : enUrl ? (
        <Link
          href={enUrl}
          className="px-2.5 py-1 text-card-foreground transition hover:bg-muted"
          title="Read the English version"
        >
          EN
        </Link>
      ) : (
        <span
          className="px-2.5 py-1 text-muted-foreground opacity-50"
          title="No English version available"
        >
          EN
        </span>
      )}
    </nav>
  );
}
