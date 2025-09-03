import { vi } from 'vitest'

// Mock process.client and NODE_ENV
Object.defineProperty(global, 'process', {
  value: {
    client: true,
    env: {
      NODE_ENV: 'test'
    }
  },
  writable: true
})

// Mock localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      didBaseUrl: 'https://did.decast.live',
      extensionId: 'test-extension-id'
    }
  }),
  useNuxtApp: () => ({
    $fetch: vi.fn()
  })
}))

// Mock $fetch globally
;(global as any).$fetch = vi.fn()
