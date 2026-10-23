import { useEffect, useRef, useState } from 'react'

/**
 * Devuelve el id de la sección "activa" usando IntersectionObserver sobre
 * una banda estrecha en el centro-alto del viewport. Sin listeners de scroll.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const visible = useRef<Set<string>>(new Set())

  useEffect(() => {
    const set = visible.current
    set.clear()
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (entry.isIntersecting) set.add(id)
          else set.delete(id)
        }
        // La primera sección (en orden de documento) que cruza la banda gana.
        const next = ids.find((id) => set.has(id)) ?? null
        setActive((prev) => (prev === next ? prev : next))
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      set.clear()
    }
  }, [ids])

  return active
}
