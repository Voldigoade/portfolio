import { initMotion, motionAllowed } from './motion';

interface Point {
  x: number;
  y: number;
}
interface Route {
  points: Point[];
  length: number;
  segments: number[];
}

function pointAt(route: Route, progress: number): Point {
  let distance = progress * route.length;
  for (let i = 0; i < route.segments.length; i++) {
    const length = route.segments[i];
    if (distance <= length) {
      const from = route.points[i];
      const to = route.points[i + 1];
      return {
        x: from.x + ((to.x - from.x) * distance) / length,
        y: from.y + ((to.y - from.y) * distance) / length,
      };
    }
    distance -= length;
  }
  return route.points[route.points.length - 1];
}

export function initSignalFields() {
  initMotion();
  document
    .querySelectorAll<HTMLElement>('[data-signal-field]')
    .forEach((field) => {
      if (field.dataset.ready) return;
      const canvas = field.querySelector('canvas');
      const context = canvas?.getContext('2d', { alpha: true });
      if (!canvas || !context) return;
      const hero = field.parentElement;
      if (!hero) return;
      const palette = getComputedStyle(field);
      const accent = palette.getPropertyValue('--color-primary').trim();
      const text = palette.getPropertyValue('--color-text').trim();
      const rgb = [1, 3, 5]
        .map((start) => Number.parseInt(accent.slice(start, start + 2), 16))
        .join(',');
      let width = 0;
      let height = 0;
      let documentTop = 0;
      let left = 0;
      let mobile = false;
      let visible = true;
      let animation = 0;
      let lastFrame = 0;
      let elapsed = 0;
      let routes: Route[] = [];
      const pointer = { x: -1000, y: -1000 };
      const buildRoute = (values: number[][]): Route => {
        const points = values.map(([x, y]) => ({
          x: x * width,
          y: y * height,
        }));
        const segments = points
          .slice(1)
          .map((point, i) =>
            Math.hypot(point.x - points[i].x, point.y - points[i].y),
          );
        return {
          points,
          segments,
          length: segments.reduce((sum, length) => sum + length, 0),
        };
      };
      const draw = (time: number) => {
        context.clearRect(0, 0, width, height);
        const heads = routes.map((route, i) =>
          pointAt(route, (time / (17000 + i * 6000) + i * 0.31) % 1),
        );
        const spacing = mobile ? 28 : 22;
        for (let x = 12; x < width; x += spacing) {
          for (let y = 18; y < height; y += spacing) {
            const nx = x / width;
            const ny = y / height;
            const edge = Math.min(1, Math.max(0, Math.abs(nx - 0.5) * 2.2));
            const envelope = Math.sin(Math.PI * Math.min(1, ny)) * 0.75 + 0.15;
            const quietCenter =
              nx > 0.25 && nx < 0.75 && ny > 0.25 && ny < 0.7 ? 0.2 : 1;
            const proximity = Math.max(
              0,
              1 - Math.hypot(x - pointer.x, y - pointer.y) / 150,
            );
            let signal = 0;
            for (const head of heads)
              signal = Math.max(
                signal,
                1 - Math.hypot(x - head.x, y - head.y) / 70,
              );
            const breath =
              0.88 + Math.sin(time / 4000 + nx * 4 + ny * 3) * 0.12;
            const alpha =
              (0.12 + edge * 0.24) * envelope * quietCenter * breath +
              proximity * 0.35 +
              signal * 0.55;
            context.fillStyle = `rgba(${rgb},${Math.min(alpha, 0.8)})`;
            const size = signal > 0.55 ? 2 : 1.2;
            context.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }
        routes.forEach((route, index) => {
          context.beginPath();
          route.points.forEach((point, i) =>
            i === 0
              ? context.moveTo(point.x, point.y)
              : context.lineTo(point.x, point.y),
          );
          context.strokeStyle = `rgba(${rgb},0.3)`;
          context.lineWidth = 0.8;
          context.stroke();
          const head = heads[index];
          const glow = context.createRadialGradient(
            head.x,
            head.y,
            0,
            head.x,
            head.y,
            16,
          );
          glow.addColorStop(0, `rgba(${rgb},0.3)`);
          glow.addColorStop(1, `rgba(${rgb},0)`);
          context.fillStyle = glow;
          context.fillRect(head.x - 16, head.y - 16, 32, 32);
          context.fillStyle = text;
          context.fillRect(head.x - 2, head.y - 2, 4, 4);
        });
      };
      const frame = (now: number) => {
        if (!visible || !motionAllowed()) {
          animation = 0;
          lastFrame = 0;
          return;
        }
        const step = mobile ? 1000 / 30 : 1000 / 60;
        if (now - lastFrame >= step - 0.75) {
          elapsed += lastFrame ? Math.min(now - lastFrame, 80) : step;
          lastFrame = now;
          draw(elapsed);
        }
        animation = requestAnimationFrame(frame);
      };
      const sync = () => {
        cancelAnimationFrame(animation);
        animation = 0;
        lastFrame = 0;
        if (visible && motionAllowed())
          animation = requestAnimationFrame(frame);
        else if (visible) draw(elapsed);
      };
      const resize = () => {
        const bounds = field.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        left = bounds.left;
        documentTop = bounds.top + window.scrollY;
        mobile = width < 740;
        const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        routes = [
          buildRoute([
            [0, 0.28],
            [0.12, 0.28],
            [0.12, 0.19],
            [0.22, 0.19],
            [0.22, 0.48],
            [0.15, 0.48],
            [0.15, 0.69],
            [0.29, 0.69],
            [0.29, 0.86],
          ]),
          buildRoute([
            [1, 0.55],
            [0.85, 0.55],
            [0.85, 0.42],
            [0.92, 0.42],
            [0.92, 0.3],
            [0.79, 0.3],
            [0.79, 0.2],
            [0.72, 0.2],
            [0.72, 0.08],
          ]),
        ];
        draw(elapsed);
        field.dataset.ready = 'true';
        sync();
      };
      const viewport = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sync();
        },
        { threshold: 0.01 },
      );
      viewport.observe(field);
      new ResizeObserver(resize).observe(field);
      hero.addEventListener(
        'pointermove',
        (event) => {
          if (mobile || !motionAllowed() || event.pointerType === 'touch')
            return;
          pointer.x = event.clientX - left;
          pointer.y = event.clientY - documentTop + window.scrollY;
        },
        { passive: true },
      );
      hero.addEventListener('pointerleave', () => {
        pointer.x = -1000;
        pointer.y = -1000;
      });
      document.addEventListener('portfolio:motion', sync);
      resize();
    });
}
