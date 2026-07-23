import { Shield, Lock, Eye, Zap, Check, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Shield,
    title: 'end-to-end encryption',
    desc: 'every byte is encrypted in transit and at rest with keys only you control.',
  },
  {
    icon: Lock,
    title: 'zero-trust access',
    desc: 'granular, identity-aware permissions so nothing is trusted by default.',
  },
  {
    icon: Eye,
    title: 'real-time monitoring',
    desc: 'continuous threat detection surfaces anomalies before they become breaches.',
  },
  {
    icon: Zap,
    title: 'compliance ready',
    desc: 'soc 2, gdpr and hipaa controls baked in, with audit trails on tap.',
  },
];

const STEPS = [
  { n: '01', title: 'connect', desc: 'link your stack in minutes with drop-in sdks and native integrations.' },
  { n: '02', title: 'monitor', desc: 'we watch every request, key and access event around the clock.' },
  { n: '03', title: 'protect', desc: 'automatic policies quarantine threats and keep your data yours.' },
];

const STATS = [
  { value: '+65k', label: 'startups use securify' },
  { value: '+1.5b', label: 'gb of data protected' },
  { value: '+300k', label: 'downloads' },
];

const TESTIMONIALS = [
  {
    quote: 'securify replaced three tools and cut our audit prep from weeks to an afternoon.',
    name: 'maya okafor',
    role: 'ciso, northwind',
  },
  {
    quote: 'the real-time alerts caught a leaked key before it ever hit production. worth it alone.',
    name: 'daniel reyes',
    role: 'head of platform, lumen',
  },
];

const PLANS = [
  {
    name: 'starter',
    price: '$0',
    cadence: '/mo',
    features: ['1 project', 'encryption at rest', 'community support'],
    highlight: false,
  },
  {
    name: 'growth',
    price: '$49',
    cadence: '/mo',
    features: ['unlimited projects', 'zero-trust access', 'real-time monitoring', 'priority support'],
    highlight: true,
  },
  {
    name: 'enterprise',
    price: "let's talk",
    cadence: '',
    features: ['dedicated tenancy', 'custom compliance', 'sso & scim', '24/7 sla'],
    highlight: false,
  },
];

/** Scrolling body sections for the securify landing page (dark theme). */
export default function SecuritySections() {
  return (
    <div className="text-white">
      {/* Trust strip */}
      <section className="reveal mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40">
          trusted by security teams at
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-white/50">
          {['northwind', 'lumen', 'orbital', 'basecamp', 'vertex', 'quanta'].map((brand) => (
            <span key={brand} className="text-lg md:text-xl font-medium tracking-tight lowercase">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="reveal max-w-2xl">
          <h2 className="hero-title text-4xl md:text-6xl font-medium lowercase">
            security that stays out of your way
          </h2>
          <p className="mt-5 text-white/60 text-base md:text-lg">
            everything you need to lock down your data — and nothing you have to babysit.
          </p>
        </div>
        <div className="reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur transition-colors hover:border-white/25"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-medium lowercase">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/10 bg-neutral-950/60 backdrop-blur-sm">
        <div className="reveal mx-auto max-w-6xl px-6 py-16 md:py-24">
          <h2 className="hero-title text-4xl md:text-6xl font-medium lowercase">how it works</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <div className="text-sm font-medium text-white/40">{step.n}</div>
                <h3 className="mt-3 text-2xl font-medium lowercase">{step.title}</h3>
                <p className="mt-3 text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="reveal grid gap-10 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-5xl md:text-6xl font-medium tracking-tight">{stat.value}</div>
              <div className="mt-2 text-sm text-white/60 lowercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="reveal grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 p-8 backdrop-blur"
              >
                <blockquote className="text-xl md:text-2xl font-medium leading-snug lowercase">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-white/60 lowercase">
                  {t.name} — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/10 bg-neutral-950/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="reveal max-w-2xl">
            <h2 className="hero-title text-4xl md:text-6xl font-medium lowercase">
              simple, honest pricing
            </h2>
            <p className="mt-5 text-white/60 text-base md:text-lg">
              start free, scale when you need to. no surprises.
            </p>
          </div>
          <div className="reveal mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlight
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-neutral-900/60 text-white'
                }`}
              >
                <div className="text-sm font-medium lowercase opacity-70">{plan.name}</div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-medium tracking-tight lowercase">{plan.price}</span>
                  <span className="mb-1 text-sm opacity-60">{plan.cadence}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm lowercase">
                      <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-normal transition-colors lowercase ${
                    plan.highlight
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="reveal rounded-3xl border border-white/10 bg-neutral-900/60 px-8 py-16 text-center backdrop-blur md:px-16">
          <h2 className="hero-title text-4xl md:text-6xl font-medium lowercase">
            start protecting your data today
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/60">
            join the teams guarding what matters with utmost care.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200 lowercase">
            get started free
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}
