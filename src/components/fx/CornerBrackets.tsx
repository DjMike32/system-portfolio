/**
 * Brackets angulares en las esquinas de las ventanas.
 * Heredan el color de `--win-glow` de la ventana padre y se expanden al hover
 * usando `scale` (compositor) en vez de cambiar ancho/alto (layout).
 */
export function CornerBrackets() {
  const base =
    'pointer-events-none absolute h-3.5 w-3.5 border-[var(--win-glow)] transition-transform duration-300 ease-[var(--ease-hud)] group-hover/window:scale-[1.35]'
  return (
    <>
      <span aria-hidden className={`${base} top-[18px] left-[18px] border-t-2 border-l-2`} />
      <span aria-hidden className={`${base} top-[18px] right-[18px] border-t-2 border-r-2`} />
      <span aria-hidden className={`${base} bottom-[18px] left-[18px] border-b-2 border-l-2`} />
      <span aria-hidden className={`${base} right-[18px] bottom-[18px] border-b-2 border-r-2`} />
    </>
  )
}
