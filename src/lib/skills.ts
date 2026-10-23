/**
 * Metadatos y utilidades de los niveles de conocimiento.
 * Vive aquí (no en `data/`) para mantener profile.ts serializable y editable
 * sin tocar presentación: los colores y etiquetas son decisiones de UI.
 */
import type { Skill, SkillCategory, SkillLevel, SkillLevelGroup } from '../data/profile'
import { SKILL_LEVEL_ORDER } from '../data/profile'

export interface SkillLevelMeta {
  /** Label visible en UI (español) */
  label: string
  /** Una frase corta que aterriza el significado del nivel */
  hint: string
  /** Color de acento (token CSS de la paleta) */
  color: string
}

export const SKILL_LEVEL_META: Record<SkillLevel, SkillLevelMeta> = {
  primary: {
    label: 'Dominio principal',
    hint: 'Uso diario en producción',
    color: 'var(--color-glow)',
  },
  solid: {
    label: 'Manejo sólido',
    hint: 'Autonomía en proyectos reales',
    color: 'var(--color-azure)',
  },
  practicing: {
    label: 'En práctica',
    hint: 'Proyectos y experimentación',
    color: 'var(--color-ok)',
  },
  learning: {
    label: 'En aprendizaje',
    hint: 'Formación activa',
    color: 'var(--color-ink-dim)',
  },
}

/**
 * Agrupa los skills de una categoría por nivel, siguiendo el orden canónico
 * (mayor a menor dominio) y omitiendo los niveles vacíos. Función pura.
 */
export function groupSkillsByLevel(skills: Skill[]): SkillLevelGroup[] {
  return SKILL_LEVEL_ORDER.flatMap((level) => {
    const group = skills.filter((skill) => skill.level === level)
    return group.length > 0 ? [{ level, skills: group }] : []
  })
}

/** Skills marcados como `featured`, para el «stack destacado» del hero. */
export function featuredSkills(categories: SkillCategory[]): Skill[] {
  return categories.flatMap((category) => category.skills.filter((skill) => skill.featured))
}
