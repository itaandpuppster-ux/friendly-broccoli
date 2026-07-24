import { useEffect, useRef, useState } from 'react';

const VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4',
];

const NAV_ITEMS = [
  { i: '01', label: 'Works' },
  { i: '02', label: 'Services' },
  { i: '03', label: 'About' },
  { i: '04', label: 'Contact' },
];

const SWITCHER = [
  { i: '01', label: 'WATER WAVE' },
  { i: '02', label: 'GRIDWAVE' },
  { i: '03', label: 'LIGHT TUNNEL' },
];

/** Full-screen creative-portfolio hero for "Viktor." with crossfading video backgrounds. */
export default function ViktorHero() {
  const [sources, setSources] = useState(VIDEOS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState('');
  const [revealed, setRevealed] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const isSlide1 = activeIndex === 0;
  const accent = isSlide1 ? '#F598F2' : '#ffffff';
  const glow = isSlide1 ? 'rgba(245,152,242,0.7)' : 'rgba(255,255,255,0.7)';

  // Preload videos as blobs for instant crossfade playback.
  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    Promise.all(
      VIDEOS.map(async (url) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const obj = URL.createObjectURL(blob);
          created.push(obj);
          return obj;
        } catch {
          return url;
        }
      }),
    ).then((resolved) => {
      if (!cancelled) setSources(resolved);
    });
    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Live clock: "CUP HH:MM:SS" (24h).
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setClock(`CUP ${fmt.format(new Date())}`);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Reveal animations trigger once when the hero enters view.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white font-figtree">
      {/* Crossfading video backgrounds */}
      {sources.map((src, i) => (
        <video
          key={i}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          src={src}
        />
      ))}
      <div className="absolute inset-0 z-[1] bg-black/10" />

      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-[1340px] items-start justify-between px-[15px] py-9 md-tablet:px-[18px] md-tablet:py-[30px] mobile:px-[18px] mobile:py-6">
          {/* Left nav */}
          <nav
            className="flex items-center gap-8 md-tablet:gap-4 mobile:hidden"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href="#" className="nav-link-underline flex items-center gap-1">
                <span className="text-[8px] font-medium uppercase leading-3 tracking-[-0.08px]">
                  {item.i}
                </span>
                <span className="text-xs font-medium uppercase leading-4 tracking-[-0.12px]">
                  / {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="hidden mobile:block text-xs font-medium uppercase tracking-[-0.12px]"
            aria-expanded={menuOpen}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>

          {/* Right cluster */}
          <div className="flex flex-col items-end gap-1 text-xs font-medium uppercase tracking-[-0.12px] mobile:hidden">
            <a href="mailto:Davies@gmail.com" className="nav-link-underline">
              Davies@gmail.com
            </a>
            <span className="tabular-nums text-white/70" aria-label="Current time">
              {clock}
            </span>
          </div>
        </div>

        {/* Mobile panel (grid-rows transition) */}
        <div
          className={`grid overflow-hidden px-[18px] transition-[grid-template-rows] duration-[420ms] mobile:block hidden ${
            menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-spring)' }}
        >
          <div className="min-h-0 overflow-hidden">
            <nav className="flex flex-col gap-2 pb-8" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="text-[28px] font-medium uppercase leading-8 tracking-[-0.84px]"
                >
                  {item.label}
                </a>
              ))}
              <a href="mailto:Davies@gmail.com" className="mt-4 text-xs uppercase text-white/70">
                Davies@gmail.com
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero content */}
      <main
        ref={contentRef}
        className="relative z-[2] mx-auto flex h-full max-w-[1340px] flex-col items-end justify-end gap-[150px] px-[15px] pt-[190px] md-tablet:gap-7 mobile:items-start mobile:gap-[72px] mobile:px-[18px] mobile:pt-[140px]"
      >
        {/* Section 1 — switcher + availability */}
        <div className="flex w-full items-end justify-between mobile:flex-col mobile:items-start mobile:gap-7">
          <div className="flex flex-[4] flex-col gap-2">
            {SWITCHER.map((item, i) => (
              <button
                key={item.label}
                onClick={() => setActiveIndex(i)}
                className={`role-link flex items-center gap-2 text-left text-xs font-medium uppercase tracking-[-0.12px] transition-opacity ${
                  i === activeIndex ? 'opacity-100' : 'opacity-55 hover:opacity-75'
                }`}
              >
                <span className="text-[8px] leading-3">{item.i}</span>
                <span>/ {item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 mobile:justify-start">
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{
                background: accent,
                boxShadow: `0 0 8px 1px ${glow}`,
                animation: 'dotPulse 1.6s ease-in-out infinite',
              }}
            />
            <span className="text-xs font-medium uppercase tracking-[-0.12px] text-white/80">
              Available for work
            </span>
          </div>
        </div>

        {/* Section 2 — name + CTA */}
        <div className="flex w-full items-end pb-[60px] md-tablet:pb-[52px] mobile:flex-col mobile:items-start mobile:gap-8 mobile:pb-11">
          <div className="flex-[2]">
            <h1
              className={`font-medium uppercase leading-[81%] tracking-[-6px] text-[200px] md-tablet:text-[129.6px] md-tablet:leading-[113.4px] md-tablet:tracking-[-7.7px] mobile:text-[clamp(68px,21vw,80px)] mobile:leading-[96px] mobile:tracking-[-4.8px] ${
                revealed ? 'viktor-reveal-up' : 'opacity-0'
              }`}
            >
              Viktor<span style={{ color: accent }}>.</span>
            </h1>
          </div>
          <div className="flex flex-1 flex-col items-start gap-6 pl-[50px] md-tablet:pl-6 mobile:pl-0">
            <p
              className={`text-base font-medium leading-6 tracking-[-0.16px] mobile:max-w-[420px] ${
                revealed ? 'viktor-reveal-right' : 'opacity-0'
              }`}
            >
              I craft bold brands and modern websites with purpose — blending strategy, motion, and
              design into work that moves people.
            </p>
            <button
              className={`viktor-cta-fill rounded-full border border-white px-6 py-3 text-sm font-medium lowercase text-white transition-colors ${
                revealed ? 'viktor-reveal-right' : 'opacity-0'
              }`}
              style={revealed ? { animationDelay: '0.08s' } : undefined}
            >
              start a project
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
