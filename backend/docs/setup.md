# Como rodar o backend

## Requisitos

- **Node.js 24** (o `.nvmrc` fixa a versão, e o `engine-strict` recusa outra). Com nvm: `nvm install && nvm use`.
- npm 11 (vem com o Node 24).
- Nada mais: o banco é SQLite, gravado num arquivo local.

## Primeira vez

Todos os comandos rodam dentro da pasta `backend/`.

```bash
# 1. Dependências. O postinstall já gera o Prisma Client.
npm install

# 2. Variáveis de ambiente
cp .env.example .env
#    preencha JWT_SECRET com um valor aleatório, por exemplo:
#    openssl rand -hex 32

# 3. Banco: cria o dev.db e aplica as migrations
npm run db:migrate

# 4. (opcional) dados de demonstração
npm run db:seed

# 5. Servidor em modo desenvolvimento
npm run dev
```

A API sobe em **http://localhost:3333/graphql**. Abrir esse endereço no navegador carrega o **Apollo Sandbox**, onde dá para explorar o schema e executar operações. Para as operações protegidas, adicione o header `Authorization: Bearer <accessToken>`.

### Usuário de demonstração (seed)

| E-mail | Senha |
|---|---|
| `conta@teste.com` | `12345678` |

O seed cria a "Conta teste" com as 8 categorias e as 9 transações que aparecem nas telas do Figma.

- **Datas:** os dias são os do Figma, mas os meses acompanham a data de hoje. Dezembro/2025 do Figma vira o mês atual e novembro vira o anterior, para o dashboard nunca abrir zerado.
- **Pode rodar de novo:** o seed apaga e recria só esse usuário.

## Variáveis de ambiente

| Variável | Exemplo | Para quê |
|---|---|---|
| `PORT` | `3333` | porta HTTP (padrão 3333) |
| `JWT_SECRET` | `openssl rand -hex 32` | segredo que assina os tokens. **Obrigatório** |
| `DATABASE_URL` | `"file:./dev.db"` | arquivo SQLite, relativo à pasta `backend/` |
| `CORS_ORIGIN` | `http://localhost:5173` | origem do frontend liberada no CORS |

Se faltar alguma variável ou houver valor inválido, o servidor não sobe e diz qual variável está errada (validação com Zod em `src/infra/env`).

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | servidor com reload automático |
| `npm run build` | gera `dist/server.js` com o tsup |
| `npm start` | roda o build e lê o `.env` se ele existir |
| `npm test` | testes unitários |
| `npm run test:watch` | testes unitários em modo watch |
| `npm run test:cov` | cobertura dos testes unitários (`core/` e `domain/`) |
| `npm run test:e2e` | testes e2e: cada arquivo usa um SQLite temporário e **não** toca no `dev.db` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | cria ou aplica migrations (`prisma migrate dev`) |
| `npm run db:seed` | popula o usuário de demonstração |
| `npm run db:studio` | abre o Prisma Studio para ver o banco |
| `npm run db:generate` | gera o Prisma Client de novo (depois de mudar o `schema.prisma`) |

A checagem de tipos é separada, porque o tsx, o tsup e o Vitest não checam tipos: `npx tsc --noEmit`.

## Rodando junto com o frontend

1. Suba o backend (`npm run dev`) com `CORS_ORIGIN=http://localhost:5173`.
2. No frontend, `VITE_BACKEND_URL=http://localhost:3333/graphql`.
3. O `codegen` do frontend lê o schema por introspecção desse endereço, então o backend precisa estar no ar.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| `Variáveis de ambiente inválidas` ao subir | falta o `.env` ou alguma variável. Veja a tabela acima |
| `Error: Connection url is empty` no Prisma | `DATABASE_URL` não definido: crie o `.env` |
| `Cannot find module '…/prisma/generated/client'` | o client não foi gerado: `npm run db:generate` |
| `The table … does not exist` | migrations não aplicadas: `npm run db:migrate` |
| `EBADENGINE` no `npm install` | Node diferente do 24: `nvm use` |
| Aviso `install-scripts … not yet covered by allowScripts` | aviso do npm 11 sobre scripts de instalação (`better-sqlite3`, Prisma, esbuild). Nesta versão eles rodam normalmente |
| Aviso "Update available 7.x → 8.0.0-rc" do Prisma | ignore: o projeto fica no Prisma 7 (ADR 0009) |
| `EADDRINUSE :3333` | já existe um servidor na porta. Encerre-o ou mude a `PORT` |
