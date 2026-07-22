import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { WordsPullUp, WordsPullUpMultiStyle } from '../components/animations'

const BODY_TEXT =
  'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.'

function AnimatedLetter({
  char,
  index,
  totalChars,
  progress,
}: {
  char: string
  index: number
  totalChars: number
  progress: MotionValue<number>
}) {
  const charProgress = index / totalChars
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1],
  )

  return <motion.span style={{ opacity }}>{char}</motion.span>
}

export default function About() {
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = BODY_TEXT.split('')

  return (
    <section className="bg-black px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl rounded-2xl md:rounded-[2rem] bg-[#101010] px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-28 text-center">
        <WordsPullUp
          text="Visual arts"
          className="text-primary text-[10px] sm:text-xs uppercase tracking-widest justify-center"
        />

        <h2 className="mt-8 sm:mt-10 md:mt-12">
          <WordsPullUpMultiStyle
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] gap-x-[0.25em] gap-y-2"
            style={{ color: '#E1E0CC' }}
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              { text: 'a self-taught director.', className: 'italic font-serif' },
              {
                text: 'I have skills in color grading, visual effects, and narrative design.',
                className: 'font-normal',
              },
            ]}
          />
        </h2>

        <p
          ref={bodyRef}
          className="mx-auto mt-10 sm:mt-14 md:mt-16 max-w-2xl text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed"
        >
          {chars.map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              totalChars={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  )
}
