import { Heading } from '@once-ui-system/core/components/Heading';
import { Button } from '@once-ui-system/core/components/Button';
import type { Locale } from '../../data/locales';
import type { DemoScene } from '../../spoor/demo/fixtures';
import { experience } from '../../data/experience';
import { MatrixField } from './MatrixField';
import { SpoorTerminal } from '../spoor/SpoorTerminal';
import { ExternalLinkIcon } from './InlineIcons';

export function HomePage({
  locale,
  previewScene,
}: {
  locale: Locale;
  previewScene?: DemoScene;
}) {
  const t = experience[locale];
  return (
    <>
      <section className="identity-hero" aria-labelledby="hero-heading">
        <MatrixField />
        <div className="identity-content">
          <Heading
            id="hero-heading"
            as="h1"
            variant="display-strong-xl"
            translate="no"
          >
            Voldigoade
          </Heading>
          <p className="identity-line">{t.identity}</p>
          <div className="hero-actions">
            <Button href="#about" rounded>
              {t.explore}
            </Button>
            <Button
              href="https://github.com/Voldigoade"
              rounded
              variant="secondary"
            >
              GitHub
            </Button>
          </div>
        </div>
      </section>
      <section
        id="about"
        className="about-section portfolio-section"
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading">{t.about}</h2>
        <div className="about-copy">
          {t.introduction.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section
        className="stack-section portfolio-section"
        aria-labelledby="stack-heading"
      >
        <h2 id="stack-heading">{t.stack}</h2>
        <div className="areas-grid">
          {t.areas.map((area) => (
            <div className="area" key={area.name}>
              <h3>{area.name}</h3>
              <ul>
                {area.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section
        id="work"
        className="work-section portfolio-section"
        aria-labelledby="work-heading"
      >
        <h2 id="work-heading">{t.work}</h2>
        <div className="work-list">
          {t.projects.map((project) => (
            <article className="work-entry" key={project.name}>
              <h3>
                <a href={project.url}>
                  {project.name} <ExternalLinkIcon />
                </a>
              </h3>
              <p>{project.description}</p>
              <span className="work-meta">{project.detail}</span>
              <div className="work-links">
                <a href={project.url}>{t.source}</a>
                {'website' in project && <a href={project.website}>{t.read}</a>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <SpoorTerminal locale={locale} previewScene={previewScene} />
    </>
  );
}
