import { memo, useEffect, useRef, useState } from 'react';
import { MatrixFx } from '@once-ui-system/core/components/MatrixFx';
import { useMotion } from './Providers';

const colors = ['neutral-solid-strong'];

export const MatrixField = memo(function MatrixField() {
  const motion = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="matrix-field" aria-hidden="true">
      <div className="matrix-fallback" />
      <MatrixFx
        fill
        size={1.5}
        spacing={5}
        colors={colors}
        fps={24}
        trigger="instant"
        flicker={motion.running && inView}
        reducedMotion={!motion.running || !inView ? true : 'auto'}
      />
    </div>
  );
});
