import SecurifyHero from '../components/SecurifyHero';
import SecuritySections from '../components/SecuritySections';
import ToonhubHero from '../components/ToonhubHero';
import ToonhubSections from '../components/ToonhubSections';
import SiteFooter from '../components/SiteFooter';

/**
 * The single, scrollable website: it flows through the securify hero and its
 * content, then the TOONHUB hero and its content, and finishes on a shared
 * footer — two brands living on one long page.
 */
export default function LandingPage() {
  return (
    <div className="w-full">
      <SecurifyHero />
      <SecuritySections />
      <ToonhubHero />
      <ToonhubSections />
      <SiteFooter />
    </div>
  );
}
