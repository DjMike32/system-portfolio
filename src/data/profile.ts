/* ═══════════════════════════════════════════════════════════════
   SYSTEM://PORTFOLIO — CONTENIDO
   ─────────────────────────────────────────────────────────────
   ✏️  EDITA AQUÍ TODO TU CONTENIDO: nombre, stack, proyectos…
   No hace falta tocar ningún otro archivo del proyecto.
   ═══════════════════════════════════════════════════════════════ */

/**
 * Niveles de conocimiento, sin porcentajes ni puntuaciones.
 * El orden del union type es semántico: de mayor a menor dominio.
 */
export type SkillLevel = 'primary' | 'solid' | 'practicing' | 'learning'

/** Orden canónico de render (índice = prioridad visual). */
export const SKILL_LEVEL_ORDER: readonly SkillLevel[] = [
  'primary',
  'solid',
  'practicing',
  'learning',
] as const

/** Claves de icono aceptadas por `SkillIcon` (`src/lib/icons.tsx`). */
export type SkillIconName = 'monitor' | 'server' | 'terminal' | 'database' | 'braces'

export interface SocialLink {
  /** Clave de icono: 'github' | 'mail' */
  id: 'github' | 'mail'
  label: string
  url: string
}

export interface Skill {
  /** slug único dentro de la categoría, p. ej. 'ts', 'react' */
  id: string
  /** Nombre visible, p. ej. 'TypeScript' */
  label: string
  level: SkillLevel
  /** true: aparece también en el «stack destacado» del hero */
  featured?: boolean
}

/** Agrupación derivada (no se edita a mano): nivel + sus skills. */
export interface SkillLevelGroup {
  level: SkillLevel
  skills: Skill[]
}

export interface SkillCategory {
  id: string
  /** Título de la categoría, p. ej. 'Frontend' */
  title: string
  /** Clave de icono válida: 'monitor' | 'server' | 'terminal' | 'database' | 'braces' */
  icon: SkillIconName
  skills: Skill[]
}

export interface Profile {
  name: string
  /** Rol profesional, p. ej. 'Fullstack Developer' */
  role: string
  /** Subtítulo / posicionamiento */
  tagline: string
  /** Ruta de la imagen (recomendado cuadrado). Placeholder en /assets/avatar.svg */
  avatar: string
  /** Bio de 2-3 frases */
  bio: string
  socials: SocialLink[]
  skillCategories: SkillCategory[]
  projects: Project[]
}

export interface Project {
  id: string
  title: string
  /** Ruta del preview (placeholders en /assets/projects/*.svg) */
  thumbnail: string
  /** Una línea, visible en la cara frontal */
  summary: string
  /** Detalle completo, visible al voltear la tarjeta */
  description: string
  features: string[]
  /** Stack del chip frontal: 3 como máximo, para que siempre quepan en una fila. */
  tech: string[]
  /**
   * Enlaces. Solo incluye `github` si el repositorio es público y existe:
   * un botón «Código» que no lleva al código del proyecto es peor que no tenerlo.
   */
  links: { github?: string; demo?: string }
  year: number
  status: 'active' | 'completed'
  /** Destacado: muestra la etiqueta «Destacado» en la tarjeta */
  featured?: boolean
}

const GITHUB = 'https://github.com/DjMike32'

export const profile: Profile = {
  name: 'Michael Chang',
  role: 'Fullstack Developer',
  tagline: 'C#/.NET · TypeScript · Vue & React — construyendo en serio desde 2019',
  avatar: '/assets/avatar.svg',
  bio: 'Construyo productos web y móviles de punta a punta: .NET y Node.js en el backend, Vue/React y React Native en la interfaz, con PostgreSQL (Supabase) y Docker en producción. Me gusta el código claro, las interfaces con carácter y que las cosas simplemente funcionen.',
  socials: [
    { id: 'github', label: 'GitHub', url: GITHUB },
    { id: 'mail', label: 'Email', url: 'mailto:michaelchang277@gmail.com' },
  ],

  skillCategories: [
    {
      id: 'frontend',
      title: 'Frontend',
      icon: 'monitor',
      skills: [
        { id: 'ts', label: 'TypeScript', level: 'primary', featured: true },
        { id: 'react', label: 'React / React Native', level: 'primary', featured: true },
        { id: 'vue', label: 'Vue 3', level: 'solid', featured: true },
        { id: 'tailwind', label: 'CSS / Tailwind', level: 'solid' },
        { id: 'astro', label: 'Astro', level: 'practicing' },
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      icon: 'server',
      skills: [
        { id: 'dotnet', label: 'C# / .NET', level: 'primary', featured: true },
        { id: 'node', label: 'Node.js', level: 'solid', featured: true },
        { id: 'sql', label: 'PostgreSQL / Supabase', level: 'solid', featured: true },
        { id: 'api', label: 'APIs REST', level: 'solid' },
        { id: 'go', label: 'Go', level: 'learning' },
      ],
    },
    {
      id: 'devops',
      title: 'DevOps',
      icon: 'terminal',
      skills: [
        { id: 'docker', label: 'Docker', level: 'solid', featured: true },
        { id: 'linux', label: 'Linux / WSL', level: 'solid' },
        { id: 'ci', label: 'CI/CD (GitHub Actions)', level: 'practicing' },
        { id: 'k8s', label: 'Kubernetes', level: 'learning' },
      ],
    },
  ],

  projects: [
    {
      id: 'meal-plater',
      title: 'Meal Plater',
      thumbnail: '/assets/projects/meal-plater.svg',
      summary: 'App móvil de planificación de comidas con recetas e imágenes.',
      description:
        'Aplicación móvil multiplataforma construida con Expo (React Native) y Supabase. Incluye autenticación, gestión de recetas con fotos, y una UI experimental con glass effect usando los módulos nativos más recientes de Expo.',
      features: [
        'React Native + Expo Router',
        'Autenticación y datos en Supabase',
        'Cámara, imágenes y almacenamiento',
        'UI con glass effect nativo',
      ],
      tech: ['React Native', 'Expo', 'Supabase'],
      links: {},
      year: 2026,
      status: 'active',
      featured: true,
    },
    {
      id: 'dental-clinic-admin',
      title: 'Ortonova · Admin Clínico',
      thumbnail: '/assets/projects/ortonova-admin.svg',
      summary: 'Panel de gestión para clínica dental: tratamientos e inventario.',
      description:
        'Panel de administración para una clínica dental que centraliza procedimientos, inventario y contabilidad. Construido con Vue 3 y Vite, con Supabase como backend para datos y autenticación.',
      features: [
        'CRUD de procedimientos y pacientes',
        'Control de inventario',
        'Módulo de contabilidad',
        'Vue 3 Composition API + Vite',
      ],
      tech: ['Vue 3', 'Supabase', 'TypeScript'],
      links: {},
      year: 2025,
      status: 'completed',
    },
    {
      id: 'boardgame-store',
      title: 'Mesa & Dados',
      thumbnail: '/assets/projects/mesa-y-dados.svg',
      summary: 'Tienda online de juegos de mesa con catálogo y stock en vivo.',
      description:
        'E-commerce para una tienda de juegos de mesa: catálogo, fichas de producto y disponibilidad de stock, servidos como sitio estático ultrarrápido con Astro y componentes Vue, respaldado por Supabase.',
      features: [
        'Sitio estático con islas Vue (Astro)',
        'Catálogo y stock desde Supabase',
        'Buen rendimiento y SEO',
        'Diseño responsive',
      ],
      tech: ['Astro', 'Vue 3', 'Supabase'],
      links: { github: `${GITHUB}/BoardGameStore` },
      year: 2025,
      status: 'completed',
    },
    {
      id: 'boardgame-store-admin',
      title: 'Mesa & Dados · Admin',
      thumbnail: '/assets/projects/mesa-y-dados-admin.svg',
      summary: 'Back-office para gestionar el inventario de la tienda.',
      description:
        'Panel interno para administrar el stock de la tienda de juegos de mesa: alta y edición de productos, control de existencias y organización del catálogo. Vue 3 + Vite con Supabase.',
      features: [
        'Gestión de stock en tiempo real',
        'CRUD de productos',
        'Validaciones y estados de carga',
        'Acceso privado con Supabase Auth',
      ],
      tech: ['Vue 3', 'Vite', 'Supabase'],
      links: {},
      year: 2025,
      status: 'completed',
    },
    {
      id: 'agent-os-dotfiles',
      title: 'AGENT-OS · Dotfiles',
      thumbnail: '/assets/projects/agent-os.svg',
      summary: 'Entorno de terminal reproducible: zsh, tmux y Neovim.',
      description:
        'Mi entorno de trabajo de terminal, reproducible de cero en una máquina nueva con un solo comando. Incluye zsh con zinit, tmux con barra temática, y Neovim con LSP, formateo y depuración, todo con un tema unificado.',
      features: [
        'Instalador idempotente',
        'Neovim con LSP y DAP',
        'tmux con indicadores git/docker/k8s',
        'Tema Catppuccin unificado',
      ],
      tech: ['Neovim', 'Lua', 'tmux'],
      links: {},
      year: 2026,
      status: 'active',
    },
  ],
}
