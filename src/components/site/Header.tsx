import { useEffect, useState } from 'react';
import { Button } from '@once-ui-system/core/components/Button';
import {
  copy,
  languageNames,
  locales,
  route,
  type Locale,
  type Page,
} from '../../data/locales';
import { experience } from '../../data/experience';

export function Header({
  locale,
  page,
  projectSlug,
}: {
  locale: Locale;
  page: Page;
  projectSlug?: string;
}) {
  const t = copy[locale];
  const [section, setSection] = useState('');
  useEffect(() => {
    if (page !== 'home') return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          visible.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        const current = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        const spoorTop =
          document.getElementById('spoor')?.getBoundingClientRect().top ??
          Number.POSITIVE_INFINITY;
        setSection(
          current && current[1] > 0
            ? current[0]
            : spoorTop <= window.innerHeight * 0.5
              ? 'spoor'
              : 'about',
        );
      },
      { rootMargin: '-10% 0px -10%', threshold: [0, 0.1, 0.4] },
    );
    document
      .querySelectorAll('main > section#about, main > section#spoor')
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [page]);
  return (
    <header className="site-header">
      <a className="identity-mark" href={route(locale)} aria-label="Voldigoade">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="m4 5 8 16 8-16h-4l-4 10-4-10Z" fill="currentColor" />
        </svg>
        <span>Voldigoade</span>
      </a>
      <nav className="floating-nav" aria-label={t.navLabel}>
        <Button
          href={`${route(locale)}#about`}
          size="s"
          rounded
          variant="tertiary"
          aria-current={section === 'about' ? 'location' : undefined}
        >
          {experience[locale].about}
        </Button>
        <span className="nav-separator" aria-hidden="true" />
        <Button
          href={`${route(locale)}#spoor`}
          onClick={() => {
            if (page === 'home') {
              window.location.hash = 'spoor';
              window.dispatchEvent(new Event('spoor:open'));
            }
          }}
          size="s"
          rounded
          variant="tertiary"
          aria-current={section === 'spoor' ? 'location' : undefined}
        >
          Spoor
        </Button>
        <span className="nav-separator desktop-only" aria-hidden="true" />
        <Button
          className="desktop-only"
          href="https://github.com/Voldigoade"
          size="s"
          rounded
          variant="tertiary"
        >
          GitHub
        </Button>
      </nav>
      <nav className="languages" aria-label={t.languageLabel}>
        {locales.map((lang) => (
          <a
            key={lang}
            href={route(lang, page, projectSlug)}
            hrefLang={lang}
            lang={lang}
            aria-label={languageNames[lang]}
            aria-current={lang === locale ? 'page' : undefined}
          >
            {lang.toUpperCase()}
          </a>
        ))}
      </nav>
    </header>
  );
}
