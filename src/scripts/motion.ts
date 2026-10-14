const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = false;

export function motionAllowed(): boolean {
  return !preference.matches && !manuallyPaused && !document.hidden;
}

function publishMotionState() {
  document.documentElement.dataset.reducedMotion = String(preference.matches);
  document.documentElement.dataset.motion = motionAllowed()
    ? 'running'
    : 'paused';
  document
    .querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')
    .forEach((button) => {
      button.hidden = preference.matches;
      button.setAttribute('aria-pressed', String(manuallyPaused));
      const label = manuallyPaused
        ? button.dataset.resume
        : button.dataset.pause;
      button.setAttribute('aria-label', label || '');
      button.title = label || '';
    });
  document.dispatchEvent(new Event('portfolio:motion'));
}

export function initMotion() {
  if (document.documentElement.dataset.motion) return;
  document
    .querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        manuallyPaused = !manuallyPaused;
        publishMotionState();
      });
    });
  preference.addEventListener('change', publishMotionState);
  document.addEventListener('visibilitychange', publishMotionState);
  const regions = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        (entry.target as HTMLElement).dataset.inView = String(
          entry.isIntersecting,
        );
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('[data-motion-region]')
    .forEach((region) => regions.observe(region));
  publishMotionState();
}
