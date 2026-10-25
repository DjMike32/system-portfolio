import { motion, useReducedMotion } from 'framer-motion'
import type { EducationItem, ExperienceItem } from '../../data/profile'
import { itemRise, staggerContainer } from '../../lib/motion'
import { SectionHeader } from '../ui/SectionHeader'
import { SystemWindow } from '../ui/SystemWindow'
import { TechChip } from '../ui/TechChip'

/**
 * Entrada de experiencia: línea de tiempo vertical con periodo, resumen,
 * logros y chips de stack. Es contenido, no un control: sin flip ni hover de
 * interacción (la señal de "actualidad" es la insignia, no el estado).
 */
function ExperienceEntry({ item }: { item: ExperienceItem }) {
  return (
    <motion.li variants={itemRise} className="relative border-l-2 border-edge pl-4 sm:pl-5">
      <span
        aria-hidden
        className={`absolute top-1.5 -left-[7px] h-3 w-3 rotate-45 border ${
          item.current ? 'border-ok bg-ok/25 shadow-[0_0_8px_var(--color-ok)]' : 'border-edge-bright bg-panel'
        }`}
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h3 className="font-display text-sm font-bold tracking-[0.14em] text-ink uppercase">
          {item.role}
        </h3>
        <span className="font-ui text-sm font-semibold text-glow">{item.org}</span>
        <span className="font-data text-[0.72rem] text-ink-off">{item.period}</span>
        {item.current && (
          <span className="border border-ok/50 bg-ok/10 px-1.5 py-0.5 font-data text-[0.66rem] tracking-[0.16em] text-ok uppercase">
            Actualidad
          </span>
        )}
      </div>

      <p className="mt-1 font-data text-[0.72rem] text-ink-off">{item.location}</p>

      <p className="mt-2.5 font-ui text-fluid-sm leading-relaxed text-ink-dim">{item.summary}</p>

      <ul className="mt-3 space-y-1.5">
        {item.highlights.map((h, i) => (
          <li key={`${i}-${h}`} className="flex items-start gap-2 font-ui text-fluid-sm text-ink">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-glow" />
            {h}
          </li>
        ))}
      </ul>

      <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Stack del puesto">
        {item.tech.map((t, i) => (
          <TechChip key={`${i}-${t}`} label={t} />
        ))}
      </ul>
    </motion.li>
  )
}

function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <motion.li variants={itemRise} className="border border-edge/70 bg-panel-sunken/60 p-4">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rotate-45 bg-azure shadow-[0_0_6px_var(--color-azure)]"
        />
        <span className="font-data text-[0.7rem] tracking-[0.18em] text-azure uppercase">
          {item.period}
        </span>
      </div>
      <h3 className="mt-2 font-display text-sm font-bold tracking-[0.1em] text-ink uppercase">
        {item.degree}
      </h3>
      <p className="mt-1.5 font-ui text-fluid-sm text-ink-dim">{item.org}</p>
    </motion.li>
  )
}

export function ExperienceSection({
  experience,
  education,
}: {
  experience: ExperienceItem[]
  education: EducationItem[]
}) {
  const reduce = useReducedMotion()
  const stagger = reduce ? undefined : staggerContainer
  const hidden = reduce ? undefined : 'hidden'
  const show = reduce ? undefined : 'show'
  const viewport = reduce ? undefined : { once: true, amount: 0.1 }

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeader index="03" title="Trayectoria" />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-5">
        <SystemWindow title="Experiencia" glow="secondary">
          <motion.ol
            aria-label="Experiencia laboral"
            className="list-none space-y-7"
            variants={stagger}
            initial={hidden}
            whileInView={show}
            viewport={viewport}
          >
            {experience.map((item) => (
              <ExperienceEntry key={item.id} item={item} />
            ))}
          </motion.ol>
        </SystemWindow>

        <SystemWindow title="Formación" glow="primary">
          <motion.ul
            aria-label="Formación reglada"
            className="list-none space-y-4"
            variants={stagger}
            initial={hidden}
            whileInView={show}
            viewport={viewport}
          >
            {education.map((item) => (
              <EducationEntry key={item.id} item={item} />
            ))}
          </motion.ul>
        </SystemWindow>
      </div>
    </section>
  )
}
