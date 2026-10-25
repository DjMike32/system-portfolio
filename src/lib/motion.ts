import type { Transition, Variants } from 'framer-motion'

/**
 * Sistema de movimiento canónico del sistema.
 * Fuente única de verdad para duraciones, easings, springs y variantes.
 * Los valores CSS equivalentes viven en `index.css` (--ease-hud*).
 *
 * Reglas de la casa:
 *  - Solo `transform` y `opacity` van animados con Motion (compositor).
 *  - Los cambios de color son transiciones CSS, nunca animaciones JS.
 *  - Ninguna animación supera los 0.7 s salvo loops ambientales.
 */

/** Escala de duraciones (segundos, para Framer Motion). */
export const DUR = {
  micro: 0.09, // feedback de press / nudge
  short: 0.14, // hover de color, borde, fondo
  base: 0.24, // entrada de items, chips
  window: 0.42, // reveal de ventana
  cine: 0.7, // boot del hero (una vez)
} as const

/** Easings (bezier cúbico [x1, y1, x2, y2]). */
export const EASE: Record<'out' | 'in' | 'std', [number, number, number, number]> = {
  out: [0.16, 1, 0.3, 1], // reveals / entradas
  in: [0.7, 0, 0.84, 0], // salidas cortas
  std: [0.2, 0, 0, 1], // tamaño / posición
}

/** Springs. `flip` está críticamente amortiguado para no emborronar texto. */
export const SPRING = {
  flip: { type: 'spring' as const, stiffness: 230, damping: 30, mass: 0.9 },
  hover: { type: 'spring' as const, stiffness: 320, damping: 30, mass: 0.7 },
  chip: { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.6 },
  tap: { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.5 },
  bar: { type: 'spring' as const, stiffness: 120, damping: 30, mass: 1 },
} satisfies Record<string, Transition>

/** Viewport reveal por defecto: una sola vez, sin remontar al scrollear. */
export const viewportOnce = { once: true, amount: 0.2 } as const
/** Para ventanas altas: dispara antes, sin esperar a media pantalla. */
export const viewportSoft = { once: true, amount: 0.12 } as const

/* ── Contenedores (stagger) ──────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

/* ── Items ───────────────────────────────────────────────────── */
export const itemRise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
}

/* ── Ventanas ────────────────────────────────────────────────── */
export const windowReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.992 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: DUR.window, ease: EASE.out } },
}
