import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['node_modules', 'dist']
  }
})
