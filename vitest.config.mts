import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// The agent runtime under test is server-only (Prisma + LLM SDK + route
// handler), so the default environment is node. vite-tsconfig-paths resolves
// the @/* -> ./src/* alias from tsconfig.json inside tests. unstubEnvs restores
// any vi.stubEnv() between tests so provider-resolution cases stay isolated.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    unstubEnvs: true,
  },
});
