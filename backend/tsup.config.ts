import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/server.ts'],
  format: 'esm',
  target: 'node24',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
})
