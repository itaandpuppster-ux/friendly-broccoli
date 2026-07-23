import SecurifyHero from '../components/SecurifyHero';
import SecuritySections from '../components/SecuritySections';
import ToonhubHero from '../components/ToonhubHero';
import ToonhubSections from '../components/ToonhubSections';
import AxonHero from '../components/AxonHero';
import MeasuredHero from '../components/MeasuredHero';
import ViktorHero from '../components/ViktorHero';
import Scene3DSection from '../components/Scene3DSection';
import SiteFooter from '../components/SiteFooter';
import SquirrelRunner from '../components/SquirrelRunner';
import { useRevealAll } from '../hooks/useReveal';

/**
 * The single, scrollable website. Each section is a clean, self-contained block
 * with scroll-reveal animations. The moving 3D scene lives in its own contained
 * Scene3DSection (in the securify area); the Measured hero has its own 3D too.
 */
export default function LandingPage() {
  useRevealAll();

  return (
    <div className="relative w-full">
      {/* Scroll-driven squirrel mascot (fixed, runs until the Axon section) */}
      <SquirrelRunner />

      <div className="relative z-10">
        <SecurifyHero />
        <Scene3DSection />
        <SecuritySections />
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
