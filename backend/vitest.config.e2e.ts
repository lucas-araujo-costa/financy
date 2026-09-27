import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['src/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    // Cadastro e login rodam bcrypt de verdade.
    testTimeout: 20_000,
    hookTimeout: 60_000,
  },
})
