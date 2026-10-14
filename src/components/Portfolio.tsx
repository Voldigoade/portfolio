import { Providers } from './site/Providers';
import { Header } from './site/Header';
import { HomePage } from './site/HomePage';
import { PrivacyPage, ProjectPage, NotFoundPage } from './site/ContentPages';
import { copy, route, type Locale, type Page } from '../data/locales';
import type { Project } from '../data/projects';
import type { DemoScene } from '../spoor/demo/fixtures';

interface Props {
  locale: Locale;
  page: Page;
  project?: Project;
  previewScene?: DemoScene;
}

export default function Portfolio({
  locale,
  page,
  project,
  previewScene,
}: Props) {
  const t = copy[locale];
  return (
    <Providers>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header locale={locale} page={page} projectSlug={project?.slug} />
      <main id="main" tabIndex={-1}>
        {page === 'home' ? (
          <HomePage locale={locale} previewScene={previewScene} />
        ) : page === 'privacy' ? (
          <PrivacyPage locale={locale} />
        ) : page === 'project' && project ? (
          <ProjectPage locale={locale} project={project} />
        ) : (
          <NotFoundPage locale={locale} />
        )}
      </main>
      <footer className="site-footer">
        <a href="https://github.com/Voldigoade">GitHub</a>
        <span aria-hidden="true">|</span>
        <a href={route(locale, 'privacy')}>{t.privacy}</a>
        {page !== 'home' && <a href={route(locale)}>Voldigoade</a>}
      </footer>
    </Providers>
  );
}
