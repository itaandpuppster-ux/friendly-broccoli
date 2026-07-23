import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SecurifyHero from './components/SecurifyHero';
import ToonhubHero from './components/ToonhubHero';

/** Small fixed "back home" chip shown on hero pages. */
function BackHome() {
  return (
    <Link
      to="/"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-black/60 backdrop-blur px-4 py-2 text-xs font-medium text-white/90 ring-1 ring-white/20 transition-colors hover:bg-black/80"
    >
      ← all heroes
    </Link>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/securify"
        element={
          <>
            <BackHome />
            <SecurifyHero />
          </>
        }
      />
      <Route
        path="/toonhub"
        element={
          <>
            <BackHome />
            <ToonhubHero />
          </>
        }
      />
    </Routes>
  );
}
