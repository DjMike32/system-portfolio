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
export type SkillIconName =
  | 'monitor'
  | 'server'
  | 'terminal'
  | 'database'
  | 'braces'
  | 'layers'

export interface SocialLink {
  /** Clave del icono de marca en `SOCIAL_ICONS` (`HeroSection.tsx`) */
  id: 'github' | 'linkedin' | 'mail'
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
  /** Clave de icono válida de `SkillIconName` (p. ej. 'monitor', 'layers') */
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
  /** Ruta del CV en PDF servido por el sitio */
  cvUrl: string
  /** Estado de disponibilidad (hero y contacto) */
  availability: string
  /** Ciudad / país */
  location: string
  socials: SocialLink[]
  /** Experiencia laboral, de la más reciente a la más antigua */
  experience: ExperienceItem[]
  /** Formación reglada */
  education: EducationItem[]
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

/** Entrada de experiencia laboral (sección «Trayectoria»). */
export interface ExperienceItem {
  /** slug único, p. ej. 'banhcafe' */
  id: string
  /** Puesto, p. ej. 'Programador' */
  role: string
  /** Empresa u organización */
  org: string
  /** Ciudad / país */
  location: string
  /** Periodo visible, p. ej. 'dic 2024 – Actualidad' */
  period: string
  /** true: muestra la insignia «Actualidad» */
  current?: boolean
  /** Una frase que resume el alcance del puesto */
  summary: string
  /** Logros concretos, como viñetas */
  highlights: string[]
  /** Tecnologías del puesto (chips) */
  tech: string[]
}

/** Entrada de formación (sección «Trayectoria»). */
export interface EducationItem {
  id: string
  /** Titulación, p. ej. 'Ingeniería en Sistemas' */
  degree: string
  /** Centro / universidad */
  org: string
  /** Periodo visible */
  period: string
}

const GITHUB = 'https://github.com/DjMike32'

export const profile: Profile = {
  name: 'Michael Chang',
  role: 'Fullstack Developer',
  tagline: 'C#/.NET · TypeScript · Vue & React — construyendo en serio desde 2019',
  avatar: '/assets/avatar.svg',
  cvUrl: '/CV_Michael_Chang_2026.pdf',
  availability: 'Abierto a oportunidades remotas',
  location: 'Tegucigalpa, Honduras',
  bio: 'Ingeniero de Sistemas con experiencia en desarrollo bancario: microservicios con .NET Minimal APIs sobre SQL Server e IBM DB2, interfaces con Vue y React, apps móviles con Expo y entregas automatizadas con Docker y CI/CD. Me gusta el código claro, las interfaces con carácter y que las cosas simplemente funcionen.',
  socials: [
    { id: 'github', label: 'GitHub', url: GITHUB },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/chang-michael-hn',
    },
    { id: 'mail', label: 'Email', url: 'mailto:mdchang21@gmail.com' },
  ],

  experience: [
    {
      id: 'banhcafe',
      role: 'Programador',
      org: 'BANHCAFE',
      location: 'Tegucigalpa, Honduras',
      period: 'dic 2024 – Actualidad',
      current: true,
      summary: 'Desarrollo de software bancario de punta a punta: microservicios, integración AS/400 y despliegues automatizados.',
      highlights: [
        'Microservicios con .NET Minimal APIs sobre SQL Server e IBM DB2, con Clean Architecture y principios SOLID.',
        'Integración de sistemas AS/400 con programas RPG y objetos IBM i, llevando funciones del core a servicios web.',
        'Páginas responsives para operaciones internas con Vue.js y ASP.NET Web Forms, consumiendo las APIs del sistema.',
        'Documentación de APIs con Swagger/OpenAPI para consumo de terceros y equipos internos.',
        'Despliegues con Docker y pipelines CI/CD en Jenkins y TeamCity; revisión de logs en Elasticsearch.',
        'Control de versiones con Git en GitHub y Azure Repos.',
      ],
      tech: ['.NET', 'SQL Server', 'AS/400', 'Vue.js', 'Docker'],
    },
  ],

  education: [
    {
      id: 'unah',
      degree: 'Ingeniería en Sistemas',
      org: 'Universidad Nacional Autónoma de Honduras',
      period: '2019 – 2025',
    },
  ],

  skillCategories: [
    {
      id: 'languages',
      title: 'Lenguajes',
      icon: 'braces',
      skills: [
        { id: 'cs', label: 'C#', level: 'primary', featured: true },
        { id: 'ts', label: 'TypeScript', level: 'primary', featured: true },
        { id: 'js', label: 'JavaScript', level: 'solid' },
        { id: 'tsql', label: 'T-SQL / SQL', level: 'solid' },
        { id: 'java', label: 'Java', level: 'practicing' },
        { id: 'rpg', label: 'RPG / AS-400', level: 'practicing' },
      ],
    },
    {
      id: 'frontend',
      title: 'Frontend',
      icon: 'monitor',
      skills: [
        { id: 'react', label: 'React / React Native', level: 'primary', featured: true },
        { id: 'vue', label: 'Vue 3', level: 'solid', featured: true },
        { id: 'tailwind', label: 'CSS / Tailwind', level: 'solid' },
        { id: 'expo', label: 'Expo', level: 'practicing' },
        { id: 'astro', label: 'Astro', level: 'practicing' },
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      icon: 'server',
      skills: [
        { id: 'dotnet', label: '.NET / Minimal APIs', level: 'primary', featured: true },
        { id: 'node', label: 'Node.js', level: 'solid', featured: true },
        { id: 'api', label: 'APIs REST', level: 'solid' },
        { id: 'aspnet', label: 'ASP.NET Web Forms', level: 'practicing' },
        { id: 'go', label: 'Go', level: 'learning' },
      ],
    },
    {
      id: 'data',
      title: 'Datos',
      icon: 'database',
      skills: [
        { id: 'postgres', label: 'PostgreSQL / Supabase', level: 'solid', featured: true },
        { id: 'sqlserver', label: 'SQL Server', level: 'solid' },
        { id: 'db2', label: 'IBM DB2', level: 'practicing' },
        { id: 'elastic', label: 'Elasticsearch', level: 'practicing' },
      ],
    },
    {
      id: 'devops',
      title: 'DevOps',
      icon: 'terminal',
      skills: [
        { id: 'docker', label: 'Docker', level: 'solid', featured: true },
        { id: 'ci', label: 'CI/CD (GitHub Actions)', level: 'solid' },
        { id: 'linux', label: 'Linux / WSL', level: 'solid' },
        { id: 'jenkins', label: 'Jenkins', level: 'practicing' },
        { id: 'teamcity', label: 'TeamCity', level: 'practicing' },
        { id: 'k8s', label: 'Kubernetes', level: 'learning' },
      ],
    },
    {
      id: 'practices',
      title: 'Prácticas',
      icon: 'layers',
      skills: [
        { id: 'micro', label: 'Microservicios', level: 'primary' },
        { id: 'clean', label: 'Clean Architecture', level: 'solid' },
        { id: 'solid', label: 'SOLID', level: 'solid' },
        { id: 'swagger', label: 'Swagger / OpenAPI', level: 'practicing' },
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
      id: 'mixed-games',
      title: 'MixedGames',
      thumbnail: '/assets/projects/mixed-games.svg',
      summary: 'Tienda online de juegos de mesa con catálogo y stock en vivo.',
      description:
        'MixedGames es un e-commerce para una tienda de juegos de mesa: catálogo, fichas de producto y disponibilidad de stock, servidos como sitio estático ultrarrápido con Astro y componentes Vue, respaldado por Supabase.',
      features: [
        'Sitio estático con islas Vue (Astro)',
        'Catálogo y stock desde Supabase',
        'Buen rendimiento y SEO',
        'Diseño responsive',
      ],
      tech: ['Astro', 'Vue 3', 'Supabase'],
      // El repo público de este proyecto es `BoardGameStore`; el resto de
      // repos de MixedGames son privados y no se enlazan.
      // `demo` apunta SIEMPRE a la URL de producción: los previews de Vercel
      // (`*-git-*.vercel.app`, los del equipo) están protegidos con SSO y un
      // visitante vería la pantalla de login en vez del sitio.
      links: { github: `${GITHUB}/BoardGameStore`, demo: 'https://mixed-games-hn.vercel.app' },
      year: 2025,
      status: 'completed',
    },
    {
      id: 'mixed-games-admin',
      title: 'MixedGames · Admin',
      thumbnail: '/assets/projects/mixed-games-admin.svg',
      summary: 'Back-office para gestionar el inventario de la tienda.',
      description:
        'Panel interno de MixedGames para administrar el stock: alta y edición de productos, control de existencias y organización del catálogo. Vue 3 + Vite con Supabase.',
      features: [
        'Gestión de stock en tiempo real',
        'CRUD de productos',
        'Validaciones y estados de carga',
        'Acceso privado con Supabase Auth',
      ],
      tech: ['Vue 3', 'Vite', 'Supabase'],
      // Back-office con Supabase Auth: el demo lleva a la pantalla de acceso.
      links: { demo: 'https://mixed-games-admin.vercel.app' },
      year: 2025,
      status: 'completed',
    },
    {
      id: 'agent-os',
      title: 'Agent OS',
      thumbnail: '/assets/projects/agent-os.svg',
      summary: 'Consola móvil para orquestar agentes y lanzar comandos por catálogo.',
      description:
        'PWA self-hosted para supervisar y dirigir agentes de OpenCode desde el móvil: tarjetas con estado en vivo, aprobación de permisos en un toque y un catálogo que ejecuta comandos por id —nunca por cadena de shell— con validación, cuotas y auditoría.',
      features: [
        'Sesiones de OpenCode con estado en tiempo real',
        'Catálogo de comandos por id con re-autenticación',
        'Sesiones revocables, TOTP y CSRF',
        'Notificaciones push vía ntfy',
      ],
      tech: ['Node.js', 'PWA', 'OpenCode'],
      links: {},
      year: 2026,
      status: 'active',
    },
    {
      id: 'jobmail',
      title: 'JobMail',
      thumbnail: '/assets/projects/jobmail.svg',
      summary: 'Clasifica el correo laboral con LLM y lo etiqueta en Gmail.',
      description:
        'Pipeline que ingiere Gmail de forma incremental, clasifica cada correo con reglas baratas más un LLM local y escribe la etiqueta JobTracker/<categoría> en la cuenta. Incluye migraciones, CLI, worker en contenedor y tests.',
      features: [
        'Ingesta incremental con history.list',
        'Clasificación híbrida: reglas + LLM',
        'Etiquetas automáticas en Gmail',
        'PostgreSQL, Alembic y Docker Compose',
      ],
      tech: ['Python', 'PostgreSQL', 'LLM'],
      links: {},
      year: 2026,
      status: 'active',
    },
    {
      id: 'job-hunter',
      title: 'Job Hunter',
      thumbnail: '/assets/projects/job-hunter.svg',
      summary: 'Buscador de ofertas que filtra, puntúa y avisa por Telegram.',
      description:
        'Sistema personal que recoge ofertas de varias fuentes (RSS, ATS y portales), las normaliza y deduplica, aplica filtros duros y las puntúa con un LLM. El bot de Telegram permite buscar, ver el perfil y forzar la ingesta.',
      features: [
        'Ingesta multi-fuente con deduplicación',
        'Scoring con LLM y fallback heurístico',
        'Bot de Telegram con comandos',
        'Scheduler, digest diario y PWA',
      ],
      tech: ['Python', 'Telegram', 'SQLite'],
      links: {},
      year: 2026,
      status: 'active',
    },
    {
      id: 'dotfiles',
      title: 'Dotfiles',
      thumbnail: '/assets/projects/dotfiles.svg',
      summary: 'Entorno de terminal reproducible: zsh, tmux y Neovim.',
      description:
        'Mi entorno de trabajo de terminal, reproducible de cero en una máquina nueva con un solo comando. Incluye zsh con zinit, tmux con barra temática y Neovim con LSP, formateo y depuración, todo con un tema unificado.',
      features: [
        'Instalador idempotente',
        'Neovim con LSP y DAP',
        'tmux con indicadores git/docker/k8s',
        'Tema Catppuccin unificado',
      ],
      tech: ['Neovim', 'Lua', 'tmux'],
      links: { github: `${GITHUB}/dotfiles` },
      year: 2026,
      status: 'active',
    },
  ],
}
