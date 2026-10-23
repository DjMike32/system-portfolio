import { MotionConfig } from 'framer-motion'
import { profile } from './data/profile'
import { BackgroundFX } from './components/fx/BackgroundFX'
import { Scanlines } from './components/fx/Scanlines'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { HeroSection } from './components/sections/HeroSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ProjectsSection } from './components/sections/ProjectsSection'

const CURRENT_YEAR = new Date().getFullYear()

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
          <ProjectsSection projects={profile.projects} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
