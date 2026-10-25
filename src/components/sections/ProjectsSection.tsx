import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ExternalLink, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Project } from '../../data/profile'
import { staggerContainer, itemRise, SPRING } from '../../lib/motion'
import { QUERY_COMPACT, useMediaQuery } from '../../lib/useMediaQuery'
import { GithubIcon } from '../ui/BrandIcons'
import { SectionHeader } from '../ui/SectionHeader'
import { SystemWindow } from '../ui/SystemWindow'
import { TechChip } from '../ui/TechChip'
import { BTN_PRIMARY, BTN_SECONDARY } from '../ui/buttonStyles'

const STATUS_META: Record<Project['status'], { label: string; dot: string }> = {
  active: { label: 'En desarrollo', dot: 'bg-ok' },
  completed: { label: 'Completado', dot: 'bg-glow' },
}

/** Miniatura + título + resumen + stack. Siempre visible (nunca se desmonta). */
function CardHead({ project }: { project: Project }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative aspect-video shrink-0 overflow-hidden border-b border-edge/60 bg-panel-sunken">
        <img
          src={project.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          width={800}
          height={450}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-[var(--ease-hud)] group-hover/card:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-panel-hi/80 to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 border border-edge/70 bg-void/85 px-1.5 py-0.5 font-data text-[0.7rem] text-ink-dim">
          <span aria-hidden className={`h-1.5 w-1.5 ${STATUS_META[project.status].dot}`} />
          {STATUS_META[project.status].label}
        </span>
        {project.featured && (
          <span className="absolute top-3 left-3 border border-glow/50 bg-void/85 px-1.5 py-0.5 font-data text-[0.7rem] tracking-[0.14em] text-glow uppercase">
            Destacado
          </span>
        )}
        <span className="absolute top-3 right-3 border border-edge/70 bg-void/85 px-1.5 py-0.5 font-data text-[0.7rem] text-ink-dim">
          {project.year}
        </span>
      </div>

      <div className="flex shrink-0 flex-col p-4">
        <h3 className="font-display text-base font-bold tracking-[0.08em] text-ink uppercase">
          {project.title}
        </h3>
        <p className="mt-1.5 font-ui text-fluid-sm leading-snug text-ink-dim">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5 pt-3">
          {project.tech.map((t, i) => (
            <TechChip key={`${i}-${t}`} label={t} />
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Detalles: meta, descripción, features y enlaces. */
function Details({
  project,
  onClose,
  controlsId,
  showTitle = true,
}: {
  project: Project
  onClose?: () => void
  /** Id del panel que controla el botón «Cerrar» (mantiene el estado expandido
   *  consultable cuando la cara del disparador ya está `inert`). */
  controlsId?: string
  showTitle?: boolean
}) {
  const status = STATUS_META[project.status]
  return (
    <div className="flex flex-col p-5">
      {showTitle ? (
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold tracking-[0.08em] text-glow uppercase">
              {project.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 font-data text-[0.7rem] text-ink-off">
              <span>{project.year}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
              <span className="uppercase">{status.label}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 font-data text-[0.7rem] text-ink-off">
          <span className="tracking-[0.2em] text-glow/70 uppercase">Ficha</span>
          <span className="h-3 w-px bg-edge" aria-hidden />
          <span>{project.year}</span>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
          <span className="uppercase">{status.label}</span>
        </div>
      )}

      <p className="mt-3 font-ui text-fluid-sm leading-relaxed text-ink-dim">
        {project.description}
      </p>

      <ul className="mt-3 space-y-1.5">
        {project.features.map((f, i) => (
          <li key={`${i}-${f}`} className="flex items-start gap-2 font-ui text-fluid-sm text-ink">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-glow" />
            {f}
          </li>
        ))}
      </ul>

      {(project.links.github || project.links.demo) && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noreferrer" className={BTN_SECONDARY}>
              <GithubIcon className="h-4 w-4" /> Código
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noreferrer" className={BTN_PRIMARY}>
              <ExternalLink className="h-4 w-4" aria-hidden /> Demo
            </a>
          )}
        </div>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-expanded={controlsId ? true : undefined}
          aria-controls={controlsId}
          className={`${BTN_SECONDARY} mt-4`}
        >
          <X className="h-4 w-4" aria-hidden /> Cerrar
        </button>
      )}
    </div>
  )
}

function ProjectCard({ project, compact }: { project: Project; compact: boolean }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const detailsId = `${project.id}-details`
  const backRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  /** Abrir en escritorio mueve el foco al panel (WCAG 2.4.3) porque la cara
   *  del disparador pasa a `inert`; al cerrar, el foco vuelve al disparador. */
  const openCard = () => {
    setOpen(true)
    requestAnimationFrame(() => backRef.current?.focus())
  }
  const closeCard = () => {
    setOpen(false)
    // El disparador sigue `inert` hasta el siguiente commit de React:
    // enfocar de forma síncrona se descartaría y el foco caería al body.
    requestAnimationFrame(() => openerRef.current?.focus())
  }
  const onBackKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') closeCard()
  }
  /** En móvil es un disclosure: el foco se queda en el disparador (patrón ARIA). */
  const toggleDisclosure = () => setOpen((v) => !v)

  // ── Móvil: divulgación (resumen siempre visible, detalles expandibles) ────
  if (compact) {
    return (
      <motion.li variants={itemRise}>
        <div
          className={`group/card overflow-hidden border transition-[color,border-color,background-color,box-shadow] duration-300 ease-[var(--ease-hud)] [contain:layout_paint] ${
            open ? 'border-glow/60 bg-panel shadow-glow-sm' : 'border-edge bg-panel-hi/70'
          }`}
        >
          <CardHead project={project} />

          <div className="px-4 pb-4">
            <button
              type="button"
              ref={openerRef}
              onClick={toggleDisclosure}
              aria-label={`Ver detalles de ${project.title}`}
              aria-expanded={open}
              aria-controls={detailsId}
              className="tap flex min-h-11 w-full items-center justify-center gap-2 border border-edge bg-void/50 font-ui text-xs font-semibold tracking-[0.1em] text-ink-dim uppercase transition-colors duration-150 ease-[var(--ease-hud)] hover:border-glow/70 hover:text-glow"
            >
              <motion.span
                aria-hidden
                animate={{ rotate: open ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : SPRING.chip}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
              Ver detalles
            </button>
          </div>

          <div
            id={detailsId}
            aria-hidden={!open}
            inert={!open}
            className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-hud)] ${
              open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-edge/60">
                <Details project={project} showTitle={false} />
              </div>
            </div>
          </div>
        </div>
      </motion.li>
    )
  }

  // ── Desktop: flip 3D (ambas caras siempre montadas) ──────────────────────
  return (
    <motion.li
      className="group/card"
      variants={itemRise}
      whileHover={reduce ? undefined : { y: -4, transition: SPRING.hover }}
    >
      <div className="relative h-[24rem] [perspective:1200px]">
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          animate={{ rotateY: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING.flip}
        >
          {/* Cara frontal: el click en la tarjeta es un atajo; el botón sigue
              siendo el control accesible. Se ignora el click que burbujea
              desde el propio botón para no duplicar el handler. */}
          <div
            aria-hidden={open}
            inert={open}
            className="absolute inset-0 flex flex-col border border-edge-strong/50 bg-panel-hi/70 transition-colors duration-300 ease-[var(--ease-hud)] group-hover/card:border-edge-strong"
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
          >
            <CardHead project={project} />
            <div className="shrink-0 px-4 pb-4">
              <button
                type="button"
                ref={openerRef}
                onClick={openCard}
                aria-label={`Ver detalles de ${project.title}`}
                aria-expanded={open}
                aria-controls={detailsId}
                className="tap flex min-h-11 w-full items-center justify-center gap-2 border border-glow/50 bg-glow/5 font-ui text-xs font-semibold tracking-[0.1em] text-glow uppercase transition-colors duration-150 ease-[var(--ease-hud)] hover:bg-glow/15"
              >
                Ver detalles
              </button>
            </div>
          </div>

          {/* Cara trasera */}
          <div
            id={detailsId}
            role="group"
            aria-label={`Detalles de ${project.title}`}
            className="sys-scroll absolute inset-0 overflow-y-auto border border-glow/60 bg-panel shadow-glow-sm"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(0)' }}
            aria-hidden={!open}
            inert={!open}
          >
            <div ref={backRef} tabIndex={-1} onKeyDown={onBackKeyDown} className="outline-none">
              <Details project={project} onClose={closeCard} controlsId={detailsId} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.li>
  )
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion()
  const compact = useMediaQuery(QUERY_COMPACT)

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeader index="01" title="Proyectos" />

      <SystemWindow title="Fichas técnicas" glow="primary">
        <motion.ul
          className="grid list-none gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3"
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? undefined : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={reduce ? undefined : { once: true, amount: 0.05 }}
        >
          {projects.map((p) => (
            // `key` con `compact`: al cruzar el breakpoint la tarjeta se remonta
            // y pierde el estado abierto, evitando caras volteadas fantasma.
            <ProjectCard key={`${p.id}-${compact}`} project={p} compact={compact} />
          ))}
        </motion.ul>
      </SystemWindow>
    </section>
  )
}
