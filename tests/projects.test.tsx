import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectsSection } from '../src/components/sections/ProjectsSection'
import type { Project } from '../src/data/profile'

const base: Project = {
  id: 'demo',
  title: 'Proyecto Demo',
  thumbnail: '/assets/projects/dotfiles.svg',
  summary: 'Resumen de prueba.',
  description: 'Descripción de prueba.',
  features: ['Una característica'],
  tech: ['TypeScript'],
  links: {},
  year: 2026,
  status: 'active',
}

const conEnlaces: Project = {
  ...base,
  id: 'con-enlaces',
  title: 'Proyecto Con Enlaces',
  links: { github: 'https://github.com/DjMike32/dotfiles', demo: 'https://example.com/demo' },
}

describe('ProjectsSection', () => {
  const abrir = (titulo: string) =>
    fireEvent.click(screen.getByRole('button', { name: `Ver detalles de ${titulo}` }))

  it('muestra los enlaces solo cuando existen', () => {
    const { rerender } = render(<ProjectsSection projects={[base]} />)
    abrir('Proyecto Demo')
    expect(screen.queryByRole('link', { name: /demo/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /código/i })).toBeNull()

    rerender(<ProjectsSection projects={[conEnlaces]} />)
    abrir('Proyecto Con Enlaces')
    expect(screen.getByRole('link', { name: /demo/i })).toHaveAttribute(
      'href',
      'https://example.com/demo',
    )
    expect(screen.getByRole('link', { name: /código/i })).toHaveAttribute(
      'href',
      'https://github.com/DjMike32/dotfiles',
    )
  })

  it('cada botón de detalles nombra su proyecto', () => {
    render(<ProjectsSection projects={[base, conEnlaces]} />)
    expect(
      screen.getByRole('button', { name: 'Ver detalles de Proyecto Demo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ver detalles de Proyecto Con Enlaces' }),
    ).toBeInTheDocument()
  })

  it('el estado es visible sin abrir la tarjeta', () => {
    render(<ProjectsSection projects={[base]} />)
    expect(screen.getAllByText('En desarrollo').length).toBeGreaterThan(0)
  })

  it('las miniaturas declaran dimensiones (evita CLS)', () => {
    const { container } = render(<ProjectsSection projects={[base]} />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '450')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
