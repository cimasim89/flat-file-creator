import { defineConfig } from 'vitest/config'

// Change to UTC
process.env.TZ = 'UTC'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'clover', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    },
  },
})
