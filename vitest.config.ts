import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/__tests__/**/*.ts'],
    env: {
      TZ: 'UTC',
    },
  },
})
