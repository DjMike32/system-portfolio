import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { profile } from './data/profile'
import { BackgroundFX } from './components/fx/BackgroundFX'
import { Scanlines } from './components/fx/Scanlines'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { HeroSection } from './components/sections/HeroSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { ProjectsSection } from './components/sections/ProjectsSection'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Al cargar con un fragmento (`michaelchang.vercel.app/#projects`, típico al
 * recargar tras navegar con el menú o al compartir un enlace), el navegador no
 * puede posicionar la sección: no existe en el DOM cuando resuelve el hash y
 * la página se queda en el inicio. Tras montar React sí existen, así que se
 * aplica el scroll una vez; `whileInView` de cada sección dispara después.
 */
function useScrollToHashOnMount() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const target = document.getElementById(id)
    if (!target) return

    let settledAt = -1
    const place = () => {
      target.scrollIntoView({ block: 'start' })
      settledAt = window.scrollY
    }
    const frame = requestAnimationFrame(place)

    // `font-display: swap`: cuando llegan las webfonts cambian las métricas de
    // todo lo anterior y la sección queda desplazada. Se recoloca una sola vez,
    // salvo que la persona ya haya hecho scroll (no se roba su posición).
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (cancelled || settledAt < 0) return
      if (Math.abs(window.scrollY - settledAt) < 4) place()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [])
}

function Footer() {
  return (
    <footer className="border-t border-edge/60 bg-deep/60 py-8 pb-24 sm:pb-8">
      <p className="mx-auto max-w-6xl px-4 text-center font-data text-xs text-ink-off sm:px-6">
        © {CURRENT_YEAR} {profile.name} · {profile.role}
      </p>
    </footer>
  )
}

export default function App() {
  useScrollToHashOnMount()
  return (
    // `reducedMotion="user"` desactiva animaciones de transform/layout en todo
    // el sitio cuando el sistema pide menos movimiento (conserva los fades).
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:border focus:border-glow focus:bg-void focus:px-4 focus:py-2 focus:font-ui focus:text-sm focus:text-glow"
        >
          Saltar al contenido
        </a>
        <BackgroundFX />
        <Scanlines />
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <HeroSection profile={profile} />
          <SkillsSection categories={profile.skillCategories} />
          <ExperienceSection experience={profile.experience} education={profile.education} />
          <ProjectsSection projects={profile.projects} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
