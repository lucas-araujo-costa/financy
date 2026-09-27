import { defineConfig } from 'prisma/config'

// O Prisma 7 não carrega o .env sozinho. As variáveis que já estão no
// ambiente têm prioridade sobre as do arquivo.
try {
  process.loadEnvFile()
} catch {
  // Sem .env (ex.: CI): as variáveis vêm do ambiente.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // `prisma generate` não usa o banco e roda no postinstall, antes de o .env
  // existir. Os comandos que usam o banco falham com mensagem clara se a
  // variável estiver vazia.
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
})
