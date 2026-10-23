import { motion, useReducedMotion } from 'framer-motion'
import type { SkillCategory, SkillLevelGroup } from '../../data/profile'
import { SkillIcon } from '../../lib/icons'
import { groupSkillsByLevel, SKILL_LEVEL_META } from '../../lib/skills'
import { itemRise, staggerContainer } from '../../lib/motion'
import { SectionHeader } from '../ui/SectionHeader'
import { SystemWindow } from '../ui/SystemWindow'
import { TechChip } from '../ui/TechChip'

/**
 * Bloque «nivel + tecnologías»: la cabecera textual es la señal de nivel,
 * sin barras ni puntuaciones. Cada nivel es un `h4` real (no texto estilizado),
 * por lo que la estructura de encabezados del documento queda
 * h2 (sección) → h3 (categoría) → h4 (nivel).
 */
function SkillLevelBlock({ group }: { group: SkillLevelGroup }) {
  const meta = SKILL_LEVEL_META[group.level]

  return (
    <li>
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rotate-45"
          style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
        />
        <h4
          className="font-display text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: meta.color }}
        >
          {meta.label}
        </h4>
      </div>
      <p className="mb-2.5 font-ui text-xs text-ink-off">{meta.hint}</p>
      <ul className="flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <TechChip key={skill.id} label={skill.label} />
        ))}
      </ul>
    </li>
  )
}

/**
 * Tarjeta de categoría. Es contenedor de información, no un elemento
 * pulsable: por eso no lleva `tap` ni hover de interacción.
 */
function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const groups = groupSkillsByLevel(category.skills)

  return (
    <motion.li variants={itemRise} className="border border-edge/70 bg-panel-sunken/60 p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-edge/60 pb-3">
        <SkillIcon name={category.icon} className="h-4 w-4 text-azure" />
        <h3 className="font-display text-sm font-bold tracking-[0.2em] text-ink uppercase">
          {category.title}
        </h3>
      </div>
      <ul className="space-y-5">
        {groups.map((group) => (
          <SkillLevelBlock key={group.level} group={group} />
        ))}
      </ul>
    </motion.li>
  )
}

export function SkillsSection({ categories }: { categories: SkillCategory[] }) {
  const reduce = useReducedMotion()

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeader index="01" title="Stack técnico" />
      <SystemWindow title="Niveles de conocimiento" glow="secondary">
        <motion.ul
          className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? undefined : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={reduce ? undefined : { once: true, amount: 0.15 }}
        >
          {categories.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </motion.ul>
      </SystemWindow>
    </section>
  )
}
