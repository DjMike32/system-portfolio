import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { profile } from '../src/data/profile'

describe('datos del perfil', () => {
  it('el CV enlazado existe realmente en public/', () => {
    // Regresión: el PDF estaba en public/ pero ningún componente lo enlazaba.
    expect(profile.cvUrl.startsWith('/')).toBe(true)
    const enDisco = resolve(process.cwd(), 'public', profile.cvUrl.replace(/^\//, ''))
    expect(existsSync(enDisco), enDisco).toBe(true)
  })

  it('cada proyecto tiene id único y miniaturas existentes', () => {
    const ids = profile.projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of profile.projects) {
      expect(p.thumbnail).toMatch(/^\/assets\/projects\/.+\.svg$/)
      const enDisco = resolve(process.cwd(), 'public', p.thumbnail.replace(/^\//, ''))
      expect(existsSync(enDisco), `${p.id}: ${enDisco}`).toBe(true)
    }
  })

  it('ningún proyecto declara una demo sin URL http', () => {
    for (const p of profile.projects) {
      if (p.links.demo) expect(p.links.demo).toMatch(/^https:\/\//)
      if (p.links.github) expect(p.links.github).toMatch(/^https:\/\//)
    }
  })
})
