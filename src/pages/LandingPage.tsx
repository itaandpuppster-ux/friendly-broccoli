import SecurifyHero from '../components/SecurifyHero';
import SecuritySections from '../components/SecuritySections';
import ToonhubHero from '../components/ToonhubHero';
import ToonhubSections from '../components/ToonhubSections';
import AxonHero from '../components/AxonHero';
import MeasuredHero from '../components/MeasuredHero';
import ViktorHero from '../components/ViktorHero';
import Showcase3D from '../components/Showcase3D';
import SiteFooter from '../components/SiteFooter';
import SquirrelRunner from '../components/SquirrelRunner';
import Experience3D from '../three/Experience3D';
import { useScrollProgress } from '../three/useScrollProgress';
import { useRevealAll } from '../hooks/useReveal';

/**
 * The single, scrollable website. A fixed WebGL layer sits behind the whole
 * page and animates with scroll; the DOM content scrolls over it, with
 * transparent "showcase" bands that let the live 3D scene shine through, and
 * scroll-reveal animations on each section.
 */
export default function LandingPage() {
  const scroll = useScrollProgress();
  useRevealAll();

  return (
    <div className="relative w-full">
      {/* Fixed 3D scene behind everything */}
      <Experience3D scroll={scroll} />

      {/* Scroll-driven squirrel mascot (fixed, runs until the Axon section) */}
      <SquirrelRunner />

      {/* Scrolling content, layered above the 3D */}
      <div className="relative z-10">
        <SecurifyHero />
        <Showcase3D
          eyebrow="security in motion"
          title="protection you can see"
          body="a live, three-dimensional core encrypting in real time — spin it, scroll it, watch it react."
          theme="dark"
        />
        <SecuritySections />
        <Showcase3D
          eyebrow="now for something playful"
          title="from data to characters"
          body="the same 3d engine, a whole new mood — say hello to the toonhub collection."
          theme="dark"
        />
        <ToonhubHero />
        <ToonhubSections />
        <AxonHero />
        <MeasuredHero />
        <ViktorHero />
        <SiteFooter />
      </div>
    </div>
  );
}
