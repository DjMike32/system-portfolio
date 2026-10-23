/**
 * Scanlines globales tipo CRT. Sin `mix-blend-mode`: un blend a viewport
 * completo obliga al compositor a mezclar todo el frame en cada scroll.
 */
export function Scanlines() {
  return (
    <div
      aria-hidden
      className="scanlines pointer-events-none fixed inset-0 z-30 opacity-[0.18]"
    />
  )
}
