/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@domain': resolve(__dirname, 'src/domain'),
      '@domain/*': resolve(__dirname, 'src/domain/*'),
      '@application': resolve(__dirname, 'src/application'),
      '@application/*': resolve(__dirname, 'src/application/*'),
      '@infrastructure': resolve(__dirname, 'src/infrastructure'),
      '@infrastructure/*': resolve(__dirname, 'src/infrastructure/*'),
    },
  },
})