# Michael Chang · SYSTEM://Portfolio

Portafolio personal con estética de **ventana de sistema**: HUD angular con
glow cian, scanlines y glitch en el nombre. Dark UI, animado y responsive, con
el stack agrupado por **niveles de conocimiento textuales** (sin porcentajes ni
puntuaciones) y las fichas de proyecto volteables.

## Stack

Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 (`@theme`) ·
Framer Motion 14 · lucide-react · fuentes self-hosted (@fontsource: Orbitron,
Rajdhani, Share Tech Mono) · oxlint.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run lint     # oxlint
npm run preview  # servir el build
```

## ✏️ Personalizar el contenido

**Todo el contenido vive en un solo archivo: [`src/data/profile.ts`](src/data/profile.ts)**

- `profile` → nombre, rol, tagline, bio, avatar y redes (`socials`)
- `skillCategories` → categorías (Frontend, Backend, DevOps) con `skills` planos:
  `{ id, label, level, featured? }`, donde `level` es
  `'primary' | 'solid' | 'practicing' | 'learning'` (se agrupan por nivel en la
  UI, en ese orden). `featured: true` añade la tecnología al «stack destacado»
  del hero.
- `projects` → título, resumen, descripción, `features`, `tech` (3 como máximo
  para que los chips quepan en una fila), `links`, año, estado y `featured?`
  (muestra la etiqueta «Destacado»).

> Los niveles de conocimiento y sus colores viven en `src/lib/skills.ts`
> (`SKILL_LEVEL_META`). No hay porcentajes: la señal de nivel es el nombre del
> grupo, no una barra.

Imágenes:

- **Avatar**: reemplaza `public/assets/avatar.svg` por tu foto y ajusta
  `avatar: '/assets/avatar.svg'`.
- **Thumbnails**: reemplaza los SVG de `public/assets/projects/*.svg` por
  capturas reales (16:9, ~800×450).

## Sistema de diseño

- **Paleta** en `@theme` (`src/index.css`) con nombres de token y contrastes
  verificados (texto ≥ AA sobre el fondo).
- **Botones** centralizados en `src/components/ui/buttonStyles.ts`
  (`BTN_PRIMARY`, `BTN_SECONDARY`): target mínimo de 44 px y foco/hover
  consistentes en todo el sitio.
- **Movimiento** centralizado en `src/lib/motion.ts`: escalas de duración
  (`DUR`), easings (`EASE`), springs (`SPRING`) y variantes reutilizables
  (`itemRise`, `staggerContainer`, `windowReveal`). CSS equivalente:
  `--ease-hud` en `index.css`.
- **Rendimiento**: solo se animan `transform`/`opacity`; sin `backdrop-blur`
  en superficies grandes ni `filter` animado en loops; los loops se pausan
  fuera de viewport.
- **Accesibilidad**: foco visible, `aria-current` en la navegación,
  controles reales (`<button>`) para abrir/cerrar tarjetas, regiones ocultas
  con `inert` + `aria-hidden`, jerarquía de encabezados h1→h4 y
  `prefers-reduced-motion` respetado en CSS, en cada componente y vía
  `MotionConfig reducedMotion="user"`.

## Responsive

- **Desktop / tablet**: navegación superior con **scroll-spy** y tarjetas con
  **flip 3D** (`perspective` + `preserve-3d`), con gestión de foco y cierre
  con `Escape`.
- **Móvil (<640px)**: **HUD de navegación inferior** (targets de 56px) y
  tarjetas en modo **acordeón** con el resumen siempre visible y los detalles
  expandibles (nada se desmonta).

## Estructura

```
src/
├─ data/profile.ts            ← ✏️ TUS DATOS
├─ lib/
│  ├─ motion.ts               duraciones, easings, springs, variantes
│  ├─ skills.ts               metadatos de niveles de conocimiento
│  ├─ icons.tsx               iconos de categorías de skills
│  ├─ useActiveSection.ts     scroll-spy (IntersectionObserver)
│  └─ useMediaQuery.ts        matchMedia reactivo (cacheado)
├─ components/
│  ├─ fx/                     BackgroundFX, Scanlines, CornerBrackets, GlitchText
│  ├─ ui/                     SystemWindow, TechChip, buttonStyles, SectionHeader,
│  │                          BrandIcons, Reveal, ScrollProgress, NavHud, AvatarFrame
│  ├─ sections/               HeroSection, SkillsSection, ProjectsSection
│  └─ Navbar.tsx
└─ App.tsx
```

## Despliegue

El build es 100 % estático (`dist/`). Funciona tal cual en Vercel, Netlify,
GitHub Pages o Cloudflare Pages.
