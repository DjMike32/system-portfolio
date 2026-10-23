import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Mail } from 'lucide-react'
import type { MouseEvent } from 'react'
import type { ComponentType } from 'react'
import type { Profile, SocialLink } from '../../data/profile'
import { featuredSkills } from '../../lib/skills'
import { itemRise, SPRING, staggerContainer } from '../../lib/motion'
import { AvatarFrame } from '../ui/AvatarFrame'
import { GlitchText } from '../fx/GlitchText'
import { Reveal } from '../ui/Reveal'
import { SystemWindow } from '../ui/SystemWindow'
import { TechChip } from '../ui/TechChip'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { BTN_PRIMARY, BTN_SECONDARY } from '../ui/buttonStyles'

/**
 * Icono de cada red social. Clave tipada con `SocialLink['id']`: añadir una
 * red en `profile.ts` sin icono aquí es **error de compilación**, no un
 * silencioso fallback al icono de GitHub.
 */
const SOCIAL_ICONS: Record<SocialLink['id'], ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
}

function Identity({ profile }: { profile: Profile }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemRise} className="max-[400px]:scale-90">
        <AvatarFrame
          src={profile.avatar}
          alt={`Retrato de ${profile.name}`}
          className="h-28 w-28 sm:h-36 sm:w-36"
        />
      </motion.div>

      <motion.div variants={itemRise}>
        <h1 className="font-display text-fluid-h1 leading-[1.05] font-extrabold tracking-[0.01em] text-ink uppercase [text-wrap:balance]">
          <GlitchText text={profile.name} />
        </h1>
        <p className="mt-3 font-display text-sm font-semibold tracking-[0.3em] text-glow uppercase">
          ⟨ {profile.role} ⟩
        </p>
        <p className="mt-2 font-ui text-fluid-lg font-medium text-ink-dim">{profile.tagline}</p>
        <p className="mt-4 max-w-prose font-ui text-fluid-base leading-relaxed text-ink-dim text-pretty">
          {profile.bio}
        </p>
      </motion.div>
    </motion.div>
  )
}

function SocialRow({ socials }: { socials: SocialLink[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 md:justify-start">
      {socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.id] ?? GithubIcon
        const external = s.url.startsWith('http')
        return (
          <a
            key={s.id}
            href={s.url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className={BTN_SECONDARY}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {s.label}
          </a>
        )
      })}
    </div>
  )
}

export function HeroSection({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion()
  const featured = featuredSkills(profile.skillCategories)

  const goToProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('projects')
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    // El scroll es interpolado, así que el hash se escribe a mano: al copiar el
    // enlace o recargar, `#projects` es coherente con lo que se ve en pantalla
    // y `useScrollToHashOnMount` reposiciona igual que en un enlace profundo.
    history.replaceState(null, '', '#projects')
  }

  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-16">
      <SystemWindow title="Perfil" glow="primary" variant="hero" boot>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <Identity profile={profile} />

          <div className="flex flex-col justify-center gap-8 border-edge/60 lg:border-l lg:pt-0 lg:pl-10">
            <div className="h-px bg-edge/60 lg:hidden" aria-hidden />

            {featured.length > 0 && (
              <Reveal delay={0.05}>
                <h2 className="mb-3 font-display text-xs font-bold tracking-[0.22em] text-azure uppercase">
                  Stack destacado
                </h2>
                <ul className="flex flex-wrap justify-center gap-1.5 md:justify-start">
                  {featured.map((skill) => (
                    <TechChip key={skill.id} label={skill.label} accent />
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <h2 className="mb-3 font-display text-xs font-bold tracking-[0.22em] text-azure uppercase">
                Accesos
              </h2>
              <div className="flex flex-col gap-3">
                <motion.a
                  href="#projects"
                  onClick={goToProjects}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  transition={SPRING.tap}
                  className={BTN_PRIMARY}
                >
                  <ArrowDown className="h-4 w-4" aria-hidden /> Ver proyectos
                </motion.a>
                <SocialRow socials={profile.socials} />
              </div>
            </Reveal>
          </div>
        </div>
      </SystemWindow>
    </section>
  )
}
