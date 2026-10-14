import { initMotion } from './motion';

function enhanceTabs(
  root: HTMLElement,
  controls: HTMLAnchorElement[],
  panels: HTMLElement[],
  select: (index: number) => void,
) {
  root.setAttribute('role', 'tablist');
  controls.forEach((control, index) => {
    control.setAttribute('role', 'tab');
    control.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', control.id);
    panels[index].tabIndex = 0;
    control.addEventListener('click', (event) => {
      event.preventDefault();
      select(index);
      window.history.replaceState(null, '', `#${panels[index].id}`);
    });
    control.addEventListener('keydown', (event) => {
      const previous = ['ArrowLeft', 'ArrowUp'].includes(event.key);
      const next = ['ArrowRight', 'ArrowDown'].includes(event.key);
      let target = index;
      if (previous) target = (index + controls.length - 1) % controls.length;
      else if (next) target = (index + 1) % controls.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = controls.length - 1;
      else if (event.key !== ' ') return;
      event.preventDefault();
      select(target);
      controls[target].focus();
      window.history.replaceState(null, '', `#${panels[target].id}`);
    });
  });
}

function syncTabs(
  controls: HTMLAnchorElement[],
  panels: HTMLElement[],
  index: number,
) {
  controls.forEach((control, i) => {
    control.classList.toggle('is-active', i === index);
    control.setAttribute('aria-selected', String(i === index));
    control.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
}

export function initResearchPreviews() {
  initMotion();
  document
    .querySelectorAll<HTMLElement>('[data-research-preview]')
    .forEach((preview) => {
      if (preview.dataset.enhanced) return;
      const controls = [
        ...preview.querySelectorAll<HTMLAnchorElement>('[data-dimension]'),
      ];
      const panels = [
        ...preview.querySelectorAll<HTMLElement>('[data-research-question]'),
      ];
      const group = preview.querySelector<HTMLElement>(
        '[data-research-controls]',
      );
      if (!group || controls.length !== panels.length) return;
      const select = (index: number) => {
        preview.dataset.active = String(index);
        syncTabs(controls, panels, index);
        preview
          .querySelectorAll('[data-research-path]')
          .forEach((path, i) =>
            path.classList.toggle('is-active', i === index),
          );
      };
      enhanceTabs(group, controls, panels, select);
      const fromHash = panels.findIndex(
        (panel) => `#${panel.id}` === window.location.hash,
      );
      select(fromHash >= 0 ? fromHash : 1);
      preview.dataset.enhanced = 'true';
    });
}

export function initLayerExplorers() {
  initMotion();
  document
    .querySelectorAll<HTMLElement>('[data-layer-explorer]')
    .forEach((explorer) => {
      if (explorer.dataset.enhanced) return;
      const controls = [
        ...explorer.querySelectorAll<HTMLAnchorElement>('[data-layer-index]'),
      ];
      const panels = [
        ...explorer.querySelectorAll<HTMLElement>('[data-layer-panel]'),
      ];
      const group = explorer.querySelector<HTMLElement>('[data-layer-tabs]');
      if (!group || controls.length !== panels.length) return;
      const select = (index: number) => {
        explorer.dataset.active = String(index);
        syncTabs(controls, panels, index);
        explorer
          .querySelectorAll('[data-stack-layer]')
          .forEach((plane, i) =>
            plane.classList.toggle('is-active', i === index),
          );
      };
      enhanceTabs(group, controls, panels, select);
      const fromHash = panels.findIndex(
        (panel) => `#${panel.id}` === window.location.hash,
      );
      select(fromHash >= 0 ? fromHash : 1);
      explorer.dataset.enhanced = 'true';
    });
}

export function initNavigation() {
  initMotion();
  document
    .querySelectorAll<HTMLAnchorElement>('[data-locale-link]')
    .forEach((link) => {
      link.addEventListener('click', () => {
        link.hash = window.location.hash;
      });
    });
  const header = document.querySelector<HTMLElement>('.site-header');
  const updateScrollState = () => {
    if (header) header.dataset.scrolled = String(window.scrollY > 32);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
  const visible = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        visible.set(
          entry.target.id,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        ),
      );
      const active = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      document
        .querySelectorAll<HTMLAnchorElement>('[data-section-link]')
        .forEach((link) => {
          if (active && active[1] > 0 && link.hash === `#${active[0]}`)
            link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
    },
    { rootMargin: '-15% 0px -35%', threshold: [0, 0.15, 0.4, 0.7] },
  );
  document
    .querySelectorAll('main > section[id], main > .layers-section')
    .forEach((section) => observer.observe(section));
}
