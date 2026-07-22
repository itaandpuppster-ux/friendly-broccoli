import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import Collective from './pages/Collective'
import Workshops from './pages/Workshops'
import Programs from './pages/Programs'
import Inquiries from './pages/Inquiries'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/collective" element={<Collective />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/inquiries" element={<Inquiries />} />
      </Routes>
    </>
  )
}
