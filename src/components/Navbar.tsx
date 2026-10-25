import { Layers, User, FolderGit2, Briefcase } from 'lucide-react'
import { useActiveSection } from '../lib/useActiveSection'
import { NavHud, type HudLink } from './ui/NavHud'

const SECTION_IDS = ['hero', 'projects', 'skills', 'experience'] as const

const LINKS: readonly HudLink[] = [
  { href: '#hero', label: 'Perfil', icon: User },
  { href: '#projects', label: 'Proyectos', icon: FolderGit2 },
  { href: '#skills', label: 'Stack', icon: Layers },
  // «Trayectoria»: el PDF del CV se descarga desde el hero y el pie, así que la
  // sección no se llama «CV» para no prometer una descarga que no hace.
  { href: '#experience', label: 'Trayectoria', ariaLabel: 'Trayectoria y formación', icon: Briefcase },
]

export function Navbar() {
  const active = useActiveSection(SECTION_IDS)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-edge/60 bg-void/95">
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <a
            href="#hero"
            className="tap font-display text-sm font-bold tracking-[0.18em] text-ink uppercase"
          >
            <span className="text-glow">Sys://</span>Portfolio
          </a>

          <ul className="hidden items-center gap-6 sm:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-label={l.ariaLabel}
                  aria-current={active === l.href.slice(1) ? 'location' : undefined}
                  className="nav-link tap font-ui text-sm font-semibold tracking-[0.14em] text-ink-dim uppercase transition-colors duration-150 hover:text-glow"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <NavHud links={LINKS} active={active} />
    </>
  )
}
