import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { env } from '@/infra/env'

import { PrismaClient } from './generated/client'

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: env.DATABASE_URL }),
})
