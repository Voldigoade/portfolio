import { useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react';
import { Button } from '@once-ui-system/core/components/Button';
import { Input } from '@once-ui-system/core/components/Input';
import type { Locale } from '../../data/locales';
import { createSpoorClient } from '../../spoor/client';
import { spoorCopy } from '../../spoor/copy';
import type { DemoScene } from '../../spoor/demo/fixtures';
import { useSpoor } from '../../spoor/useSpoor';
import { CompactReport } from './CompactReport';
import { reportCopy } from '../../spoor/report-copy';
import { ProgressLog } from './ProgressLog';

export function SpoorTerminal({
  locale,
  previewScene,
}: {
  locale: Locale;
  previewScene?: DemoScene;
}) {
  const t = spoorCopy[locale];
  const scene = import.meta.env.DEV ? previewScene : undefined;
  const [expanded, setExpanded] = useState(Boolean(scene));
  const [navigationRequest, setNavigationRequest] = useState(0);
  const [target, setTarget] = useState(
    scene && scene !== 'idle' ? 'demo-user' : '',
  );
  const input = useRef<HTMLInputElement>(null);
  const client = useMemo(() => createSpoorClient(scene), [scene]);
  const lookup = useSpoor(client);
  const { run } = lookup;
  const busy = lookup.phase === 'starting' || lookup.phase === 'running';
  const invalid = lookup.error?.code === 'invalidTarget';
  useEffect(() => {
    if (scene && scene !== 'idle' && scene !== 'populated')
      void run('demo-user');
  }, [scene, run]);
  useEffect(() => {
    if (invalid) input.current?.focus();
  }, [invalid]);
  useEffect(() => {
    const reveal = () => {
      if (window.location.hash !== '#spoor') return;
      setExpanded(true);
      setNavigationRequest((value) => value + 1);
    };
    window.addEventListener('hashchange', reveal);
    window.addEventListener('spoor:open', reveal);
    reveal();
    return () => {
      window.removeEventListener('hashchange', reveal);
      window.removeEventListener('spoor:open', reveal);
    };
  }, []);
  useEffect(() => {
    if (!expanded || !navigationRequest) return;
    input.current?.focus({ preventScroll: true });
    document.getElementById('spoor')?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }, [expanded, navigationRequest]);
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run(target);
  };
  const status =
    busy && lookup.recovering
      ? reportCopy[locale].recovering
      : busy
        ? lookup.phase === 'starting'
          ? t.starting
          : t.running
        : lookup.report
          ? t[lookup.report.status]
          : '';
  return (
    <section
      id="spoor"
      className="spoor-section"
      aria-labelledby="spoor-heading"
    >
      <div
        className="spoor-shell"
        data-expanded={expanded}
        data-phase={lookup.phase}
      >
        <header className="spoor-header">
          <div className="spoor-title">
            <h2 id="spoor-heading" translate="no">
              Spoor
            </h2>
            <p>{t.subtitle}</p>
          </div>
          <Button
            type="button"
            variant="tertiary"
            rounded
            size="s"
            aria-expanded={expanded}
            aria-controls="spoor-content"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? t.minimize : t.open}
            <svg
              className="disclosure-icon"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path
                d="m4 6 4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </header>
        <div
          id="spoor-content"
          className="spoor-disclosure"
          inert={!expanded}
          aria-hidden={!expanded}
        >
          <div className="spoor-disclosure-inner">
            <form className="lookup-form" onSubmit={submit} noValidate>
              <Input
                ref={input}
                className="lookup-input"
                id="spoor-target"
                name="target"
                aria-label={t.target}
                placeholder={t.placeholder}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={180}
                variant="ghost"
                size="s"
                errorMessage={invalid ? t.errors.invalidTarget : undefined}
                focusRing={false}
              />
              <Button
                type="submit"
                rounded
                size="s"
                disabled={!target.trim() || busy}
              >
                {t.inspect}
              </Button>
            </form>
            <span
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {status}
            </span>
            {busy && (
              <div className="lookup-output" aria-busy="true">
                <div className="progress-heading">
                  <p>
                    <span className="working-indicator" aria-hidden="true" />
                    {status}
                  </p>
                  <Button variant="tertiary" size="s" onClick={lookup.reset}>
                    {t.stop}
                  </Button>
                </div>
                <ProgressLog lines={lookup.lines.slice(-3)} locale={locale} />
              </div>
            )}
            {lookup.error && !invalid && (
              <div className="lookup-error" role="alert">
                <p>{t.errors[lookup.error.code]}</p>
                {lookup.phase === 'rateLimited' && (
                  <p className="error-hint">{t.rateHint}</p>
                )}
              </div>
            )}
            {lookup.report && (
              <div className="lookup-output">
                <CompactReport
                  key={lookup.report.id}
                  client={client}
                  report={lookup.report}
                  locale={locale}
                />
              </div>
            )}
            <noscript>
              <p className="lookup-error">{t.noScript}</p>
            </noscript>
          </div>
        </div>
      </div>
    </section>
  );
}
