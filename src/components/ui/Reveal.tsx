import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DUR, EASE, viewportOnce } from '../../lib/motion'

type RevealTag = 'div' | 'ul' | 'li' | 'section' | 'article'

/** Mapa estático de tags (no se crean componentes dinámicamente en render). */
const TAGS = {
  div: motion.div,
  ul: motion.ul,
  li: motion.li,
  section: motion.section,
  article: motion.article,
} as const

interface RevealProps {
  children: ReactNode
  as?: RevealTag
  /** Retardo (s) dentro de un stagger. */
  delay?: number
  className?: string
  amount?: number
}

/**
 * Envuelve contenido con un reveal suave al entrar en viewport.
 * Animación canónica: fade + 14px, una sola vez (`once`).
 * Con `prefers-reduced-motion` renderiza el elemento tal cual.
 */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  className,
  amount = viewportOnce.amount,
}: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = TAGS[as] as typeof motion.div

  if (reduce) return <Tag className={className}>{children}</Tag>

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DUR.base, ease: EASE.out, delay }}
    >
      {children}
    </Tag>
  )
}
