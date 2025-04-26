import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    css: false,
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
