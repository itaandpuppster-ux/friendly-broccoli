import Hero from '../sections/Hero'
import About from '../sections/About'
import Features from '../sections/Features'

export default function Home() {
  return (
    <div className="bg-black">
      <Hero />
      <About />
      <Features />
    </div>
  )
}
