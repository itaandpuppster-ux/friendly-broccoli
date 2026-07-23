import SecurifyHero from '../components/SecurifyHero';
import SecuritySections from '../components/SecuritySections';
import ToonhubHero from '../components/ToonhubHero';
import ToonhubSections from '../components/ToonhubSections';
import AxonHero from '../components/AxonHero';
import MeasuredHero from '../components/MeasuredHero';
import ViktorHero from '../components/ViktorHero';
import SiteFooter from '../components/SiteFooter';
import SquirrelRunner from '../components/SquirrelRunner';
import { useRevealAll } from '../hooks/useReveal';

/**
 * The single, scrollable website. Each section is a clean, self-contained block
 * with scroll-reveal animations; the only 3D lives inside the Measured hero as
 * its scroll-driven object.
 */
export default function LandingPage() {
  useRevealAll();

  return (
    <div className="relative w-full">
      {/* Scroll-driven squirrel mascot (fixed, runs until the Axon section) */}
      <SquirrelRunner />

      <div className="relative z-10">
        <SecurifyHero />
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
