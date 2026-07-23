import { useEffect } from 'react';

/**
 * Reveals every `.reveal` element once it reaches the lower part of the
 * viewport, adding `is-visible` to drive the CSS animation in index.css.
 *
 * Uses a rAF-throttled scroll/resize check rather than IntersectionObserver
 * threshold crossings, so elements scrolled (or anchor-jumped) past never get
 * stuck at opacity:0. Call once near the root.
 */
export function useRevealAll() {
  useEffect(() => {
    let pending = false;

    const reveal = () => {
      pending = false;
      const trigger = window.innerHeight * 0.88;
      const nodes = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top < trigger) {
          node.classList.add('is-visible');
        }
      });
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(reveal);
    };

    reveal(); // reveal whatever is already in view on load
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
