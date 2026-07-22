import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { WordsPullUpMultiStyle } from '../components/animations'

const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

const ICONS = {
  storyboard:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  critiques:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  capsule:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
}

const EASE = [0.22, 1, 0.36, 1] as const

function CardShell({
  index,
  className = '',
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function FeatureCard({
  index,
  icon,
  title,
  number,
  items,
}: {
  index: number
  icon: string
  title: string
  number: string
  items: string[]
}) {
  return (
    <CardShell index={index} className="bg-[#212121] p-5 sm:p-6 flex flex-col min-h-[380px] lg:min-h-0">
      <div className="flex flex-col h-full">
        <img
          src={icon}
          alt=""
          className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
        />

        <h3 className="mt-5 sm:mt-6 text-base sm:text-lg" style={{ color: '#E1E0CC' }}>
          {title} <span className="text-gray-500 text-xs align-super">({number})</span>
        </h3>

        <ul className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span className="text-gray-400 text-xs sm:text-sm leading-snug">{item}</span>
            </li>
          ))}
        </ul>

        <button className="group mt-auto pt-8 flex items-center gap-1.5 self-start text-xs sm:text-sm text-primary">
          Learn more
          <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </button>
      </div>
    </CardShell>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const headerY = useTransform(scrollYProgress, [0, 0.5], [60, -20])
  const gridY = useTransform(scrollYProgress, [0, 0.5], [80, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div className="text-center mb-12 sm:mb-16 md:mb-20" style={{ y: headerY }}>
          <h2>
            <WordsPullUpMultiStyle
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-3xl mx-auto gap-x-[0.25em] gap-y-1"
              segments={[
                {
                  text: 'Studio-grade workflows for visionary creators.',
                  className: 'text-primary',
                },
                {
                  text: 'Built for pure vision. Powered by art.',
                  className: 'text-gray-500',
                },
              ]}
            />
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]"
          style={{ y: gridY }}
        >
          <CardShell index={0} className="min-h-[380px] lg:min-h-0">
            <video
              src={CARD_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p
              className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-base sm:text-lg"
              style={{ color: '#E1E0CC' }}
            >
              Your creative canvas.
            </p>
          </CardShell>

          <FeatureCard
            index={1}
            icon={ICONS.storyboard}
            title="Project Storyboard."
            number="01"
            items={[
              'Map every scene from first spark to final cut.',
              'Drag-and-drop sequencing for shots and acts.',
              'Attach references, scripts, and moodboards.',
              'Share living boards with your whole crew.',
            ]}
          />

          <FeatureCard
            index={2}
            icon={ICONS.critiques}
            title="Smart Critiques."
            number="02"
            items={[
              'AI analysis of pacing, color, and composition.',
              'Creative notes threaded frame by frame.',
              'Integrations with your favorite editing tools.',
            ]}
          />

          <FeatureCard
            index={3}
            icon={ICONS.capsule}
            title="Immersion Capsule."
            number="03"
            items={[
              'Silence notifications during deep work sessions.',
              'Ambient soundscapes tuned to your scene.',
              'Sync focus blocks with your production schedule.',
            ]}
          />
        </motion.div>
      </div>
    </section>
  )
}
