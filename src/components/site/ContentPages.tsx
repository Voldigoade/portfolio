import { Button } from '@once-ui-system/core/components/Button';
import { copy, route, type Locale } from '../../data/locales';
import type { Project } from '../../data/projects';
import { BackArrowIcon, ExternalLinkIcon } from './InlineIcons';

export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <article className="prose-page page-wrap">
      <a className="back-link" href={route(locale)}>
        <BackArrowIcon /> {t.home}
      </a>
      <h1>{t.privacyTitle}</h1>
      <p className="lead">{t.privacyDescription}</p>
      {t.privacySections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
        </section>
      ))}
      <a className="text-link" href="https://vercel.com/legal/privacy-policy">
        {t.hostPrivacy} <ExternalLinkIcon />
      </a>
    </article>
  );
}

export function ProjectPage({
  locale,
  project,
}: {
  locale: Locale;
  project: Project;
}) {
  const t = copy[locale];
  const p = project.translations[locale];
  return (
    <article className="project-page page-wrap">
      <a className="back-link" href={route(locale)}>
        <BackArrowIcon /> {t.home}
      </a>
      <header className="project-header">
        <p className="status">{p.status}</p>
        <h1>{p.title}</h1>
        <p className="lead">{p.description}</p>
        <div className="actions">
          <Button href={project.website[locale]} rounded>
            {t.visit}
          </Button>
          <Button href={project.repository} rounded variant="secondary">
            {t.repository}
          </Button>
        </div>
      </header>
      <section>
        <h2>{p.question}</h2>
        <p>{p.context}</p>
      </section>
      <dl className="dimension-list">
        {p.dimensions.map((dimension, i) => (
          <div key={dimension.title} id={`dimension-${i}`}>
            <dt>{dimension.title}</dt>
            <dd>{dimension.text}</dd>
          </div>
        ))}
      </dl>
      <div className="research-columns">
        <div>
          <section>
            <h2>{p.methodTitle}</h2>
            <p>{p.method}</p>
          </section>
          <section>
            <h2>{p.limitsTitle}</h2>
            <p>{p.limits}</p>
          </section>
        </div>
        <aside>
          <h2>{p.artifactsTitle}</h2>
          <ul>
            {p.artifacts.map((artifact) => (
              <li key={artifact}>{artifact}</li>
            ))}
          </ul>
          <a className="text-link" href={project.repository}>
            {t.repository} <ExternalLinkIcon />
          </a>
        </aside>
      </div>
      <section>
        <h2>{p.statusTitle}</h2>
        <p>{p.statusText}</p>
        <a className="text-link" href={project.website[locale]}>
          {t.visit} <ExternalLinkIcon />
        </a>
      </section>
    </article>
  );
}

export function NotFoundPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className="prose-page page-wrap not-found">
      <p className="status">404</p>
      <h1>{t.notFound}</h1>
      <p className="lead">{t.notFoundText}</p>
      <Button href={route(locale)} rounded>
        {t.home}
      </Button>
    </div>
  );
}
