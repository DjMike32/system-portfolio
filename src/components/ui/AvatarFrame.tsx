import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

interface AvatarFrameProps {
  src: string
  alt: string
  /** Controla el tamaño (el img usa h-full/w-full). */
  className?: string
}

/**
 * Retrato con anillo de glow y halo giratorio sutil.
 * El halo solo anima `rotate` (compositor) y se pausa fuera de viewport.
 */
export function AvatarFrame({ src, alt, className = '' }: AvatarFrameProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0 })

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <div
        aria-hidden
        className="absolute -inset-1.5 rounded-full bg-linear-to-b from-glow/50 to-azure/20 blur-md"
      />
      {!reduce && inView && (
        <motion.span
          aria-hidden
          className="absolute -inset-2 rounded-full border border-glow/25"
          style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={144}
        height={144}
        loading="eager"
        decoding="async"
        className="relative h-full w-full rounded-full border-2 border-glow/70 object-cover shadow-glow-sm"
      />
    </div>
  )
}
