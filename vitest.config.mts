import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit tests for the business rules (services, content pipeline, helpers).
// They run in plain Node — no browser, no database.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // `server-only` throws outside React Server Components; in tests it's a no-op.
    alias: { "server-only": path.resolve(import.meta.dirname, "src/test/serverOnlyStub.ts") },
  },
});
