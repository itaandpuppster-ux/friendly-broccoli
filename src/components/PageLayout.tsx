import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import { WordsPullUp, WordsPullUpMultiStyle, FadeUp } from './animations'

interface PageLayoutProps {
  label: string
  titleSegments: { text: string; className?: string }[]
  intro: string
  children?: React.ReactNode
}

export default function PageLayout({ label, titleSegments, intro, children }: PageLayoutProps) {
  const headerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  })
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15])

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        <Navbar />

        <motion.header
          ref={headerRef}
          className="px-4 sm:px-6 md:px-10 pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 text-center"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <WordsPullUp
            text={label}
            className="text-primary text-[10px] sm:text-xs uppercase tracking-widest justify-center"
          />
          <h1 className="mt-6 sm:mt-8">
            <WordsPullUpMultiStyle
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[0.95] sm:leading-[0.9] gap-x-[0.25em] gap-y-2"
              style={{ color: '#E1E0CC' }}
              segments={titleSegments}
            />
          </h1>
          <motion.p
            className="mx-auto mt-8 sm:mt-10 max-w-xl text-primary/70 text-xs sm:text-sm md:text-base"
            style={{ lineHeight: 1.4 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {intro}
          </motion.p>
        </motion.header>
      </div>

      <main className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-28">{children}</main>

      <footer className="px-4 sm:px-6 md:px-10 pb-10">
        <FadeUp className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            Prisma — a worldwide collective of visual artists.
          </p>
          <Link
            to="/"
            className="group flex items-center gap-2 hover:gap-3 bg-primary rounded-full pl-5 pr-1.5 py-1.5 text-black font-medium text-sm transition-all duration-300"
          >
            Back home
            <span className="flex items-center justify-center bg-black rounded-full w-9 h-9 transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="w-4 h-4" style={{ color: '#E1E0CC' }} />
            </span>
          </Link>
        </FadeUp>
      </footer>
    </div>
  )
}

export function ContentCard({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: React.ReactNode
}) {
  return (
    <FadeUp
      delay={index * 0.15}
      className="rounded-2xl bg-[#212121] p-6 sm:p-8 flex flex-col gap-3"
    >
      <h3 className="text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
        {title}
      </h3>
      <div className="text-gray-400 text-xs sm:text-sm leading-relaxed">{children}</div>
    </FadeUp>
  )
}
