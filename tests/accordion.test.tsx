import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Fuerza el modo compacto (móvil) sin depender de matchMedia.
vi.mock('../src/lib/useMediaQuery', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/lib/useMediaQuery')>()
  return { ...actual, useMediaQuery: () => true }
})

import { ProjectsSection } from '../src/components/sections/ProjectsSection'
import type { Project } from '../src/data/profile'

const proyecto: Project = {
  id: 'movil',
  title: 'Proyecto Móvil',
  thumbnail: '/assets/projects/dotfiles.svg',
  summary: 'Resumen.',
  description: 'Descripción.',
  features: ['Una'],
  tech: ['TS'],
  links: { demo: 'https://example.com/demo' },
  year: 2026,
  status: 'completed',
}

describe('tarjeta en modo compacto', () => {
  it('es un disclosure accesible: aria-expanded y inert', () => {
    const { container } = render(<ProjectsSection projects={[proyecto]} />)
    const boton = screen.getByRole('button', { name: 'Ver detalles de Proyecto Móvil' })
    const panel = container.querySelector('#movil-details') as HTMLElement

    expect(boton).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('inert')
    expect(panel).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(boton)

    expect(boton).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('inert')
    expect(panel).toHaveAttribute('aria-hidden', 'false')
  })
})
