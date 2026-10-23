import type { ComponentType } from 'react'

export interface HudLink {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

interface NavHudProps {
  links: readonly HudLink[]
  active: string | null
}

/**
 * HUD de navegación inferior para móvil (<640px): targets de 56px, alcance
 * natural del pulgar y sin máquina de estados de menú (cero trampas de foco).
 */
export function NavHud({ links, active }: NavHudProps) {
  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-edge/70 bg-void/95 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch">
        {links.map((l) => {
          const isActive = active === l.href.slice(1)
          const Icon = l.icon
          return (
            <li key={l.href} className="flex-1">
              <a
                href={l.href}
                aria-current={isActive ? 'location' : undefined}
                className={`tap flex min-h-14 flex-col items-center justify-center gap-1 font-ui text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-colors duration-150 ${
                  isActive ? 'text-glow' : 'text-ink-off'
                }`}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
