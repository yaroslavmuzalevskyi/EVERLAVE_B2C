import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
  },
  resolve: {
    // Mirror tsconfig's "@/*" -> "./*" alias.
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
