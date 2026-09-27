# 0003. Prisma 7 + SQLite com o adapter `better-sqlite3`

**Status:** aceita

## Contexto
O desafio exige Prisma e SQLite. O Prisma 7 trocou os engines em Rust por **driver adapters** e passou a configurar o datasource num `prisma.config.ts`.

## Decisão
- `@prisma/adapter-better-sqlite3` com `DATABASE_URL="file:./dev.db"`, relativo à pasta `backend/`.
- O generator `prisma-client` escreve o client em `src/infra/database/prisma/generated/`. Essa pasta fica fora do git e é recriada no `postinstall`.
- O `prisma.config.ts` lê o `.env` com `process.loadEnvFile()` nativo do Node 24, sem dotenv.
- O `datasource.url` usa `process.env.DATABASE_URL ?? ''`, e não `env()`, que lançaria erro. Assim o `prisma generate` do `postinstall` roda num clone novo antes de o `.env` existir.
- **IDs:** UUID, gerados no domínio. Tabelas e colunas em snake_case via `@@map`/`@map`.
- **Testes e2e:** cada arquivo cria um SQLite no diretório temporário, roda `prisma migrate deploy` e apaga o arquivo no fim.

## Consequências
- Não precisa instalar nem subir banco: o SQLite é um arquivo.
- O `better-sqlite3` é um módulo nativo, com binário pré-compilado para o Node 24.
- O SQLite tem limites (o `LIKE` só ignora maiúsculas em ASCII), tratados na ADR 0006.
