import { Heading } from '@once-ui-system/core/components/Heading';
import { Button } from '@once-ui-system/core/components/Button';
import type { Locale } from '../../data/locales';
import type { DemoScene } from '../../spoor/demo/fixtures';
import { experience } from '../../data/experience';
import { MatrixField } from './MatrixField';
import { SpoorTerminal } from '../spoor/SpoorTerminal';

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
        <p>{t.introduction}</p>
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
      <SpoorTerminal locale={locale} previewScene={previewScene} />
    </>
  );
}
