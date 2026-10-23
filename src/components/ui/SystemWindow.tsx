import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { viewportSoft, windowReveal } from '../../lib/motion'
import { CornerBrackets } from '../fx/CornerBrackets'

interface SystemWindowProps {
  title: string
  /** Color de acento (brackets, título, sweep). */
  glow?: 'primary' | 'secondary'
  /** hero: más padding + barrido de luz interno. */
  variant?: 'default' | 'hero'
  /** true: anima al montar (boot del hero). false: anima al entrar en viewport. */
  boot?: boolean
  className?: string
  children: ReactNode
}

/**
 * Primitiva central: ventana de sistema con marco angular (clip-path),
 * barra de título y brackets. Todo el contenido vive dentro de una de estas.
 *
 * Rendimiento: fondo sólido (sin `backdrop-blur`, que se repinta por frame al
 * scrollear), reveal sin `filter: blur` y el barrido del hero pausado cuando
 * la ventana sale de pantalla.
 */
export function SystemWindow({
  title,
  glow = 'primary',
  variant = 'default',
  boot = false,
  className = '',
  children,
}: SystemWindowProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0 })
  const glowColor = glow === 'secondary' ? 'var(--color-azure)' : 'var(--color-glow)'
  const inner = variant === 'hero' ? 'p-5 pb-7 sm:p-10' : 'p-4 pb-6 sm:p-8'

  return (
    <motion.div
      ref={ref}
      className={`group/window relative ${className}`}
      style={{ '--win-glow': glowColor } as CSSProperties}
      variants={reduce ? undefined : windowReveal}
      initial={reduce ? undefined : 'hidden'}
      animate={boot ? 'show' : undefined}
      whileInView={boot ? undefined : 'show'}
      viewport={boot ? undefined : viewportSoft}
    >
      {/* Capa exterior = marco angular */}
      <div className="window-clip bg-edge p-px transition-colors duration-300 group-hover/window:bg-edge-bright">
        {/* Capa interior = panel (sólido, con luz superior sutil) */}
        <div className="window-clip-inner relative overflow-hidden bg-panel">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(0,229,255,0.06), transparent 70%)',
            }}
          />

          {/* Barra de título */}
          <div className="relative flex items-center justify-between border-b border-edge/70 px-4 py-3 sm:px-7">
            <div className="flex items-center gap-2.5 font-display text-[0.72rem] font-semibold tracking-[0.22em] text-[var(--win-glow)] uppercase">
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--win-glow)] shadow-[0_0_8px_var(--win-glow)]" />
              {title}
            </div>
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--win-glow)]" />
              <span className="h-1.5 w-1.5 rotate-45 border border-edge-bright" />
              <span className="h-1.5 w-1.5 rotate-45 border border-edge-bright" />
            </div>
          </div>

          <CornerBrackets />

          {/* Barrido de luz interno (solo hero), pausado fuera de viewport. */}
          {variant === 'hero' && !reduce && inView && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.06]"
              style={{
                background:
                  'linear-gradient(180deg, transparent, rgba(0,229,255,.9), transparent)',
              }}
              animate={{ y: ['-120%', '1200%'] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: 'linear', repeatDelay: 3 }}
            />
          )}

          <div className={`relative ${inner}`}>{children}</div>
        </div>
      </div>
    </motion.div>
  )
}
