import { useCallback, useSyncExternalStore } from 'react'

/**
 * `matchMedia` reactivo sin flicker ni re-render inicial (useSyncExternalStore).
 * Las MediaQueryList se cachean por query: una sola instancia compartida y un
 * único listener por suscriptor (no se crean objetos nuevos en cada render).
 */
const cache = new Map<string, MediaQueryList>()

function getMql(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  let mql = cache.get(query)
  if (!mql) {
    mql = window.matchMedia(query)
    cache.set(query, mql)
  }
  return mql
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = getMql(query)
      if (!mql) return () => {}
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => getMql(query)?.matches ?? false, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Breakpoint que casa con el `sm:` de Tailwind (40rem), no en px fijos. */
export const QUERY_COMPACT = '(max-width: 39.999rem)'
