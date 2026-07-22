import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { WordsPullUp } from '../components/animations'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const containerScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const containerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section ref={sectionRef} className="h-screen p-4 md:p-6 bg-black">
      <motion.div
        className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden"
        style={{ scale: containerScale, opacity: containerOpacity }}
      >
        <motion.video
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ y: videoY, scale: 1.15 }}
        />

        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        <Navbar />

        <motion.div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-10 pb-6 md:pb-10"
          style={{ y: contentY }}
        >
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              <h1>
                <WordsPullUp
                  text="Prisma"
                  showAsterisk
                  className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
                  style={{ color: '#E1E0CC' }}
                />
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col items-start gap-5 sm:gap-6 pb-2 md:pb-4">
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base max-w-sm"
                style={{ lineHeight: 1.2 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              >
                Prisma is a worldwide network of visual artists, filmmakers and storytellers
                bound not by place, status or labels but by passion and hunger to unlock
                potential through our unique perspectives.
              </motion.p>

              <motion.button
                className="group flex items-center gap-2 hover:gap-3 bg-primary rounded-full pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2 text-black font-medium text-sm sm:text-base transition-all duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
              >
                Join the lab
                <span className="flex items-center justify-center bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E1E0CC' }} />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
