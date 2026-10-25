import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom no implementa matchMedia ni IntersectionObserver: los componentes los
// usan (useMediaQuery, whileInView), así que se simulan aquí.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: ObserverStub })
Object.defineProperty(window, 'ResizeObserver', { writable: true, value: ObserverStub })

afterEach(() => cleanup())
