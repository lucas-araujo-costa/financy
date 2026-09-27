import 'reflect-metadata'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, beforeAll } from 'vitest'

// Um banco SQLite novo por arquivo de teste. As variáveis precisam existir
// antes de o app (e o env/index.ts) ser importado pelo teste.
const databaseFile = join(tmpdir(), `financy-e2e-${randomUUID()}.db`)

process.env.DATABASE_URL = `file:${databaseFile}`
process.env.JWT_SECRET = 'e2e-test-secret'
process.env.CORS_ORIGIN = 'http://localhost:5173'

beforeAll(() => {
  execSync('npx prisma migrate deploy', { env: process.env, stdio: 'ignore' })
})

afterAll(async () => {
  const { prisma } = await import('@/infra/database/prisma/client')
  await prisma.$disconnect()

  for (const suffix of ['', '-journal', '-wal', '-shm']) {
    rmSync(databaseFile + suffix, { force: true })
  }
})
