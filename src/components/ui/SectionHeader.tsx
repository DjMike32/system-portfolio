import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'

interface SectionHeaderProps {
  index: string
  title: string
}

/** Cabecera de sección estilo misión: [01] TÍTULO ──── */
export function SectionHeader({ index, title }: SectionHeaderProps) {
  const reduce = useReducedMotion()

  return (
    <div className="mb-8 flex items-center gap-4">
      <span aria-hidden className="font-data text-sm text-ink-off">
        [{index}]
      </span>
      <h2 className="font-display text-fluid-h2 font-bold tracking-[0.12em] text-ink uppercase">
        {title}
      </h2>
      <motion.span
        aria-hidden
        className="h-px flex-1 origin-left bg-gradient-to-r from-glow/60 to-transparent"
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: EASE.out }}
      />
    </div>
  )
}
