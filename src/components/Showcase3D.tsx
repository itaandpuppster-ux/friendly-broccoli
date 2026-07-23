type Showcase3DProps = {
  eyebrow: string;
  title: string;
  body: string;
  theme?: 'dark' | 'light';
};

/**
 * A transparent, full-viewport band whose only job is to let the fixed 3D scene
 * behind the page show through, with a headline floating over it. Because the
 * 3D layer animates with scroll, passing through this section reads as a 3D
 * moment in the page.
 */
export default function Showcase3D({ eyebrow, title, body, theme = 'dark' }: Showcase3DProps) {
  const text = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const muted = theme === 'dark' ? 'text-white/70' : 'text-neutral-600';
  return (
    <section className="relative flex h-screen w-full items-center justify-center px-6">
      <div className={`reveal max-w-3xl text-center ${text}`}>
        <p className={`text-xs uppercase tracking-[0.3em] ${muted}`}>{eyebrow}</p>
        <h2 className="hero-title mt-5 text-5xl md:text-7xl font-medium lowercase">{title}</h2>
        <p className={`mx-auto mt-6 max-w-xl text-base md:text-lg ${muted}`}>{body}</p>
      </div>
    </section>
  );
}
