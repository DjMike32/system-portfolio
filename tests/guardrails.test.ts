import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (rel: string) =>
  readFileSync(new URL(rel, import.meta.url), 'utf8')

describe('invariantes de rendimiento', () => {
  it('ninguna duración de animación supera 0.7 s', () => {
    const src = read('../src/lib/motion.ts')
    const bloque = src.slice(src.indexOf('export const DUR'), src.indexOf('}', src.indexOf('export const DUR')))
    const valores = [...bloque.matchAll(/(\w+):\s*([\d.]+)/g)].map((m) => Number(m[2]))
    expect(valores.length).toBeGreaterThan(0)
    for (const v of valores) expect(v).toBeLessThanOrEqual(0.7)
  })

  it('el CSS no transiciona propiedades de layout', () => {
    const css = read('../src/index.css')
    const prohibidas = /transition:[^;}]*\b(width|height|top|left|right|bottom|margin|padding)\b/g
    expect(css.match(prohibidas)).toBeNull()
  })

  it('los loops ambientales se apagan con reduced motion', () => {
    const css = read('../src/index.css')
    expect(css).toMatch(/prefers-reduced-motion/)
    // Se acepta tanto `animation: none` como la convención de duración ínfima.
    expect(css).toMatch(/animation(-duration)?:\s*(none|0\.01ms)/)
  })
})
