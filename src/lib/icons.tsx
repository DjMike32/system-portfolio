import { Braces, Code2, Database, Monitor, Server, Terminal } from 'lucide-react'
import type { SkillIconName } from '../data/profile'

interface SkillIconProps {
  /** Clave de icono usada en profile.ts */
  name: SkillIconName
  className?: string
}

/**
 * Icono de categoría de skills. Switch estático (sin crear componentes
 * dinámicamente en render) para mantener el lint limpio.
 */
export function SkillIcon({ name, className }: SkillIconProps) {
  switch (name) {
    case 'monitor':
      return <Monitor className={className} aria-hidden />
    case 'server':
      return <Server className={className} aria-hidden />
    case 'terminal':
      return <Terminal className={className} aria-hidden />
    case 'database':
      return <Database className={className} aria-hidden />
    case 'braces':
      return <Braces className={className} aria-hidden />
    default:
      return <Code2 className={className} aria-hidden />
  }
}
