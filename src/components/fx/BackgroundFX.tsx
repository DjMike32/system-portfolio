/** Fondo estático multicapa: grid, gradientes radiales, noise y viñeta. Todo CSS, coste ~0. */
export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1100px 700px at 75% -10%, rgba(0,229,255,.07), transparent 60%), radial-gradient(900px 600px at 10% 110%, rgba(74,158,255,.05), transparent 60%)',
        }}
      />
      <div className="bg-noise absolute inset-0" />
      <div className="bg-vignette absolute inset-0" />
    </div>
  )
}
