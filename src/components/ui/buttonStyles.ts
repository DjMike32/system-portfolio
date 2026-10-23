/**
 * Estilos de botón canónicos del sitio.
 * Una sola fuente: ajustar contraste, target táctil o tipografía se hace
 * aquí y se propaga al hero, a las fichas de proyecto y a cualquier CTA nuevo.
 *
 * Reglas: target mínimo de 44 px (`min-h-11`), color en transición CSS,
 * `box-shadow` listado explícitamente (Tailwind lo separa de `transition-colors`).
 */
export const BTN_PRIMARY =
  'tap flex min-h-11 items-center justify-center gap-2 border border-glow/60 bg-glow/10 px-4 font-ui text-fluid-sm font-semibold tracking-[0.1em] text-glow uppercase transition-[background-color,border-color,box-shadow] duration-150 ease-[var(--ease-hud)] hover:bg-glow/20 hover:shadow-glow-sm'

export const BTN_SECONDARY =
  'tap flex min-h-11 items-center justify-center gap-2 border border-edge bg-void/60 px-4 font-ui text-fluid-sm font-semibold tracking-[0.08em] text-ink-dim uppercase transition-[color,border-color,background-color,box-shadow] duration-150 ease-[var(--ease-hud)] hover:border-glow/70 hover:text-glow hover:shadow-glow-sm'
