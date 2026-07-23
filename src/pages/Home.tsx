import { Link } from 'react-router-dom';

const PAGES = [
  {
    to: '/securify',
    title: 'securify',
    desc: 'Data-security SaaS hero — looping video background, floating pill navbar, staggered typography.',
  },
  {
    to: '/toonhub',
    title: 'TOONHUB',
    desc: 'Character-figurine carousel — rotating 3D roles, giant ghost type, animated crossfades.',
  },
];

/** Landing index that links to each hero page. */
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">friendly-broccoli</p>
      <h1 className="hero-title text-5xl md:text-7xl font-medium mb-3 text-center">hero showcase</h1>
      <p className="text-white/60 text-center max-w-md mb-14">
        Each page below is a standalone full-viewport hero section built with React, TypeScript, and
        Tailwind CSS.
      </p>

      <div className="grid gap-5 w-full max-w-2xl">
        {PAGES.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur px-7 py-6 transition-colors hover:border-white/30"
          >
            <div>
              <div className="text-xl font-medium tracking-tight mb-1">{page.title}</div>
              <div className="text-sm text-white/60">{page.desc}</div>
            </div>
            <span className="text-white/40 text-2xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
