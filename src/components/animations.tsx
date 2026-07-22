import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
  style?: React.CSSProperties
}

export function WordsPullUp({ text, className = '', showAsterisk = false, style }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <motion.span
            key={i}
            className="relative inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {isLast && showAsterisk && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
            {!isLast && ' '}
          </motion.span>
        )
      })}
    </div>
  )
}

interface Segment {
  text: string
  className?: string
}

export function WordsPullUpMultiStyle({
  segments,
  className = '',
  style,
}: {
  segments: Segment[]
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' })),
  )

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((item, i) => (
        <motion.span
          key={i}
          className={`inline-block ${item.className}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  )
}

export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 20, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
