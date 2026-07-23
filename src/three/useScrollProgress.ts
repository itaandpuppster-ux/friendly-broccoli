import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * Tracks overall page scroll as a 0..1 progress value in a ref (no re-renders),
 * so a requestAnimationFrame loop / useFrame can read it every frame.
 */
export function useScrollProgress(): MutableRefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
