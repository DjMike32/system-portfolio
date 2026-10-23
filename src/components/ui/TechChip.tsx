import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { SPRING } from '../../lib/motion'

interface TechChipProps {
  label: string
  /** true: acento cian (para el «stack destacado» del hero). */
  accent?: boolean
  className?: string
}

/**
 * Chip de tecnología: la única fuente de estilo de chip del sitio
 * (hero, skills y proyectos). No es interactivo: es texto con marco,
 * por eso no lleva `tap` ni rol de botón. El lift del hover es solo
 * microdecoración visual, nunca una promesa de acción.
 *
 * El tinte del chip destacado va en `style` (no en una clase de fondo más):
 * el inline style gana siempre sobre las utilidades, así no compiten dos
 * `background-color` con la misma especificidad.
 */
export function TechChip({ label, accent = false, className = '' }: TechChipProps) {
  const reduce = useReducedMotion()

  const style: CSSProperties = accent
    ? {
        backgroundColor: 'color-mix(in srgb, var(--color-glow) 8%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-glow) 42%, transparent)',
        color: 'var(--color-glow)',
      }
    : {}

  return (
    <motion.li
      className={`inline-flex items-center whitespace-nowrap border bg-void/50 px-2 py-1 font-data text-[0.7rem] leading-none tracking-[0.06em] uppercase transition-[color,border-color,background-color] duration-[160ms] ease-[var(--ease-hud)] ${
        accent ? '' : 'border-edge/70 text-ink-dim hover:border-edge-strong'
      } ${className}`}
      style={style}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={SPRING.chip}
    >
      {label}
    </motion.li>
  )
}
