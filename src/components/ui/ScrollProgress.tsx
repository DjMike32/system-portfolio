import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { SPRING } from '../../lib/motion'

/** Barra de progreso de scroll. Escribe solo `transform` (scaleX). */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: SPRING.bar.stiffness,
    damping: SPRING.bar.damping,
    mass: 0.6,
  })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[45] h-0.5 origin-left bg-linear-to-r from-glow via-azure to-glow"
      style={{ scaleX }}
    />
  )
}
