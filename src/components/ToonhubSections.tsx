import { Star, Truck, Brush, PackageCheck, ArrowRight } from 'lucide-react';

const PRODUCTS = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    name: 'ember',
    price: '$48',
    bg: '#F79B7F',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    name: 'clover',
    price: '$48',
    bg: '#85CC92',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    name: 'blossom',
    price: '$52',
    bg: '#ED9DC4',
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    name: 'sky',
    price: '$52',
    bg: '#8DC4FF',
  },
];

const PERKS = [
  { icon: Brush, title: 'Hand-painted', desc: 'Every figurine is finished by hand for a flawless, gallery-grade look.' },
  { icon: PackageCheck, title: 'Premium finish', desc: 'Durable resin, matte topcoat, and packaging that arrives ready to gift.' },
  { icon: Truck, title: 'Ships worldwide', desc: 'Fast, tracked delivery — most orders arrive within 5–7 business days.' },
];

const REVIEWS = [
  { quote: 'The artwork is stunning and shipped fully prepared. The 3D craft is flawless!', name: 'Priya S.' },
  { quote: 'Better than the render. The finish is a vision — already ordered the whole set.', name: 'Marcus L.' },
  { quote: 'Wishing you the win. These are the nicest figurines I have ever owned.', name: 'Aiko T.' },
];

const ANTON = { fontFamily: 'Anton, sans-serif' } as const;

/** Scrolling body sections for the TOONHUB store (light theme). */
export default function ToonhubSections() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="bg-neutral-50 text-neutral-900">
      {/* Product grid */}
      <section id="shop" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="reveal flex items-end justify-between gap-6">
          <h2 style={ANTON} className="text-4xl md:text-6xl uppercase leading-none">
            The collection
          </h2>
          <p className="hidden sm:block max-w-xs text-sm text-neutral-500">
            Four characters, endless shelf appeal. Pick your favorite or collect them all.
          </p>
        </div>
        <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="group">
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{ backgroundColor: p.bg, aspectRatio: '0.8 / 1' }}
              >
                <img
                  src={p.src}
                  alt={p.name}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: 'bottom center' }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold uppercase tracking-wide">{p.name}</span>
                <span className="text-neutral-500">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craft / perks */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="reveal grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                the craft
              </p>
              <h2 style={ANTON} className="mt-3 text-4xl md:text-6xl uppercase leading-none">
                Made to be shown off
              </h2>
              <p className="mt-5 text-neutral-600 leading-relaxed">
                TOONHUB figurines start as bold 3D characters and end as tactile collectibles you
                will actually want on your desk. Sculpted, cast, and hand-finished in small batches.
              </p>
            </div>
            <div className="grid gap-4">
              {PERKS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 style={ANTON} className="text-4xl md:text-6xl uppercase leading-none">
          Loved by collectors
        </h2>
        <div className="reveal mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-neutral-200 bg-white p-8">
              <div className="flex gap-1 text-neutral-900">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-medium leading-snug">“{r.quote}”</blockquote>
              <figcaption className="mt-5 text-sm text-neutral-500">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="reveal mx-auto max-w-6xl rounded-3xl bg-neutral-900 px-8 py-16 text-center text-white md:px-16">
          <h2 style={ANTON} className="text-4xl md:text-6xl uppercase leading-none">
            Order yours now
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/70">
            Free shipping on the full set. Ships fully prepared, straight to your shelf.
          </p>
          <a
            href="#shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Shop the collection
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </section>
    </div>
  );
}
