import { configDefaults, defineConfig } from "vitest/config";

// Change to UTC
process.env.TZ = "UTC";

export default defineConfig({
  test: configDefaults,
});
