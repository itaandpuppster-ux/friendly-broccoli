const COLUMNS = [
  {
    heading: 'securify',
    links: ['platform', 'solutions', 'pricing', 'security', 'docs'],
  },
  {
    heading: 'toonhub',
    links: ['the collection', 'the craft', 'shipping', 'gift cards', 'returns'],
  },
  {
    heading: 'company',
    links: ['about', 'careers', 'blog', 'contact', 'support'],
  },
];

/** Shared footer for the combined single-page site. */
export default function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 256 256" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z"
                  fill="#ffffff"
                />
              </svg>
              <span className="text-sm font-normal tracking-tight lowercase">friendly-broccoli</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              one page, two brands — a security platform and a figurine store, stitched into a
              single scroll.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                {col.heading}
              </div>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/70 transition-colors hover:text-white lowercase"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <span>© 2026 friendly-broccoli. all rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white lowercase">
              privacy
            </a>
            <a href="#" className="transition-colors hover:text-white lowercase">
              terms
            </a>
            <a href="#" className="transition-colors hover:text-white lowercase">
              cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
