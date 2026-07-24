import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils, Mesh } from 'three';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85';
const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4';
const OVERLAY_IMAGE =
  'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png';

const NAV_ITEMS = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us'];

const REVEAL_MASK = (x: number, y: number) =>
  `radial-gradient(circle 260px at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;

/** Scroll-driven 3D object layered into the Measured hero — the "good scroll animation". */
function ScrollDevice({ progress }: { progress: MutableRefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current;
    // idle spin + scroll-driven tumble and scale
    m.rotation.y += delta * 0.25;
    m.rotation.x = MathUtils.lerp(m.rotation.x, p * Math.PI * 2, 0.08);
    m.rotation.z = MathUtils.lerp(m.rotation.z, p * Math.PI, 0.08);
    const s = MathUtils.lerp(m.scale.x, 0.85 + p * 0.9, 0.08);
    m.scale.setScalar(s);
  });
  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1, 0.28, 200, 28]} />
      <meshStandardMaterial
        color="#aebfd0"
        emissive="#5f7fa0"
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/** Full-viewport "Measured" wearable hero with layered imagery + cursor spotlight reveal. */
export default function MeasuredHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cursor spotlight reveal + grid parallax (rAF-smoothed).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const target = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const gridTarget = { x: 0, y: 0 };
    const grid = { x: 0, y: 0 };
    let active = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      gridTarget.x = ((target.x - r.width / 2) / (r.width / 2)) * 16;
      gridTarget.y = ((target.y - r.height / 2) / (r.height / 2)) * 16;
      active = true;
    };
    const onLeave = () => {
      active = false;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      smooth.x += (target.x - smooth.x) * 0.1;
      smooth.y += (target.y - smooth.y) * 0.1;
      grid.x += (gridTarget.x - grid.x) * 0.06;
      grid.y += (gridTarget.y - grid.y) * 0.06;
      if (revealRef.current) {
        const mask = active ? REVEAL_MASK(smooth.x, smooth.y) : REVEAL_MASK(-9999, -9999);
        revealRef.current.style.webkitMaskImage = mask;
        revealRef.current.style.maskImage = mask;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate(${grid.x}px, ${grid.y}px)`;
      }
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Section scroll progress feeds the 3D object.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      scrollProgress.current = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const Logo = (
    <svg width="28" height="28" viewBox="0 0 256 256" aria-hidden="true">
      <path
        d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z"
        fill="#fff"
      />
    </svg>
  );

  return (
    <section
      ref={sectionRef}
      className="font-helvetica-neue relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Layer 1 — Grid background */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.1 }}>
        <div ref={gridRef} className="absolute" style={{ inset: '-32px' }}>
          <svg width="100%" height="100%" aria-hidden="true">
            <defs>
              <pattern id="measured-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#measured-grid)" />
          </svg>
        </div>
      </div>

      {/* Layer 2 — Background image */}
      <div
        className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
      />

      {/* 3D scroll animation layer */}
      <div className="absolute inset-0 z-[15] pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4.6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 5]} intensity={1.1} />
          <pointLight position={[-4, -3, 2]} intensity={0.5} color="#88a" />
          <ScrollDevice progress={scrollProgress} />
        </Canvas>
      </div>

      {/* Layer 3 — Hero text */}
      <h1
        className="absolute inset-x-0 z-20 text-center uppercase text-white top-20 sm:top-28 md:top-32 text-[4.5rem] xs:text-[5.5rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem] leading-[0.9]"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Measured
      </h1>

      {/* Layer 4 — Overlay image */}
      <img
        src={OVERLAY_IMAGE}
        alt=""
        className="absolute inset-0 z-[25] w-full h-full object-cover pointer-events-none"
      />

      {/* Layer 5 — Spotlight reveal video */}
      <div ref={revealRef} className="absolute inset-0 z-30 pointer-events-none">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: 'inset(40% 0 0 0)' }}
          autoPlay
          loop
          muted
          playsInline
          src={FRONT_VIDEO}
        />
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-10">
        <a href="#" aria-label="Measured home" className="flex items-center">
          {Logo}
        </a>

        {/* Center pill nav */}
        <nav
          className="liquid-glass hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button className="liquid-glass hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Reserve Yours
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="liquid-glass md:hidden flex flex-col items-end gap-1 rounded-full px-4 py-3"
        >
          <span className="block h-[1.5px] w-5 bg-white" />
          <span className="block h-[1.5px] w-3.5 bg-white" />
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[55] flex flex-col items-center justify-center" style={{ background: '#0a0a0a' }}>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="liquid-glass absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ animation: 'measured-close-in 0.5s cubic-bezier(0.77,0,0.18,1) both' }}
          >
            <span className="absolute h-[1.5px] w-5 bg-white" style={{ transform: 'rotate(45deg)' }} />
            <span className="absolute h-[1.5px] w-5 bg-white" style={{ transform: 'rotate(-45deg)' }} />
          </button>

          <div className="flex flex-col items-center gap-6">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="text-3xl sm:text-4xl font-medium text-white/90"
                style={{
                  animation: `measured-item-in 0.6s cubic-bezier(0.77,0,0.18,1) both`,
                  animationDelay: `${100 + i * 60}ms`,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <button
            className="liquid-glass mt-12 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
            style={{
              animation: `measured-item-in 0.6s cubic-bezier(0.77,0,0.18,1) both`,
              animationDelay: `${100 + NAV_ITEMS.length * 60}ms`,
            }}
          >
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Reserve Yours
          </button>
        </div>
      )}
    </section>
  );
}
