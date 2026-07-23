import { useEffect, useRef } from 'react';

/**
 * A scroll-driven squirrel mascot fixed to the bottom of the viewport. It runs
 * left-to-right as you scroll down, advancing proportionally to how far you've
 * scrolled toward the Axon section, and stops (sits) once that section is
 * reached. Scrolling back up rewinds it. Built as inline SVG so it never
 * depends on an external asset.
 */
export default function SquirrelRunner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const idleTimer = useRef<number>(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const compute = () => {
      rafRef.current = 0;
      const stopTarget = document.getElementById('axon-hero');
      const stopY = stopTarget
        ? stopTarget.offsetTop
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress = stopY > 0 ? Math.min(1, Math.max(0, window.scrollY / stopY)) : 0;

      const margin = 16;
      const width = el.offsetWidth || 76;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const x = margin + progress * (maxX - margin);
      el.style.transform = `translateX(${x}px)`;
      el.classList.toggle('is-stopped', progress >= 1);
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(compute);
      // running state while actively scrolling; idle shortly after
      el.classList.add('is-running');
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => el.classList.remove('is-running'), 160);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="squirrel-runner" aria-hidden="true">
      <svg viewBox="0 0 76 60" width="76" height="60" role="img">
        <g className="sq-bob">
          {/* Tail */}
          <g className="sq-tail">
            <path
              d="M28 50 C6 50 4 24 20 16 C31 10 42 18 38 29 C35 37 24 36 24 28 C24 23 31 22 32 27"
              fill="#7a4a24"
            />
            <path
              d="M27 46 C11 46 10 26 22 20 C30 16 37 22 34 29 C32 34 26 33 26 28"
              fill="#a9713e"
            />
          </g>
          {/* Back leg */}
          <ellipse className="sq-leg sq-leg-back" cx="34" cy="50" rx="5" ry="3.4" fill="#7a4a24" />
          {/* Body */}
          <ellipse cx="40" cy="36" rx="13" ry="15" fill="#8a5a2b" />
          {/* Belly */}
          <ellipse cx="44" cy="40" rx="8" ry="10" fill="#caa06e" />
          {/* Front leg */}
          <ellipse className="sq-leg sq-leg-front" cx="44" cy="51" rx="5" ry="3.4" fill="#8a5a2b" />
          {/* Acorn in paws */}
          <g>
            <ellipse cx="52" cy="40" rx="3.4" ry="3.8" fill="#b9822f" />
            <rect x="48.8" y="34.6" width="6.4" height="3" rx="1.5" fill="#6f4a1b" />
          </g>
          {/* Head */}
          <circle cx="55" cy="26" r="11" fill="#8a5a2b" />
          {/* Ear */}
          <path d="M50 15 C50 10 55 9 57 13 C58 15 55 18 51 18 Z" fill="#7a4a24" />
          <path d="M52 15 C52 12 55 12 56 14 Z" fill="#a9713e" />
          {/* Cheek */}
          <ellipse cx="60" cy="30" rx="5.5" ry="4.5" fill="#caa06e" />
          {/* Eye */}
          <circle cx="57" cy="24" r="2" fill="#241a10" />
          <circle cx="57.7" cy="23.3" r="0.6" fill="#fff" />
          {/* Nose */}
          <circle cx="65" cy="28" r="1.7" fill="#3a271a" />
        </g>
      </svg>
    </div>
  );
}
