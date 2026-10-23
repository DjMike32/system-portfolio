interface GlitchTextProps {
  text: string
  className?: string
}

/**
 * Texto con glitch CSS: dos clones (cian y rojo) que destellan ~150 ms
 * dentro de un ciclo de 9 s. Los clones son spans reales con aria-hidden
 * para no triplicar la lectura en lectores de pantalla.
 */
export function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <span className={`glitch ${className}`}>
      {text}
      <span aria-hidden className="glitch-clone glitch-clone-a">
        {text}
      </span>
      <span aria-hidden className="glitch-clone glitch-clone-b">
        {text}
      </span>
    </span>
  )
}
