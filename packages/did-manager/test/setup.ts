import { vi } from 'vitest'

// Optional: extend expect with jest-dom if needed
// import '@testing-library/jest-dom'

// Mock minimal localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

// Basic process mock for isomorphic checks
Object.defineProperty(global, 'process', {
  value: {
    client: true,
    env: { NODE_ENV: 'test' }
  },
  writable: true
})
