# Financy

Aplicação fullstack de gerenciamento de finanças pessoais: o usuário cria uma conta, organiza **categorias** e registra **transações** de entrada e saída, com um dashboard de saldo e movimentação do mês.

Desafio prático da Pós-Graduação da Rocketseat. Layout: [Financy no Figma](https://www.figma.com/community/file/1580994817007013257).

## Funcionalidades

- Criar conta e fazer login
- Cada usuário vê e gerencia **apenas** as próprias transações e categorias
- Transações: criar, editar, excluir e listar, com busca, filtros (tipo, categoria e mês) e paginação
- Categorias: criar, editar, excluir e listar, com ícone, cor, quantidade de transações e total movimentado
- Dashboard: saldo total, receitas e despesas do mês, transações recentes e resumo por categoria
- Perfil: editar o nome e sair da conta

## Estrutura do repositório

São **duas aplicações independentes**, cada uma com as próprias dependências, variáveis de ambiente e documentação. Elas conversam **só pelo contrato GraphQL via HTTP**.

```
financy/
├── backend/    API GraphQL (Node.js)
└── frontend/   aplicação web (React)
```

## Stack

| | Backend | Frontend |
|---|---|---|
| Linguagem | TypeScript | TypeScript |
| Base | Node.js 24 + Fastify | React 19 + Vite |
| GraphQL | Apollo Server + TypeGraphQL | Apollo Client + GraphQL Codegen |
| Dados | Prisma + SQLite | — |
| Autenticação | JWT (`@fastify/jwt`) + bcrypt | token no `localStorage`/`sessionStorage` ("Lembrar-me") |
| UI | — | Tailwind CSS + shadcn/ui (Radix) + Lucide |
| Formulários | — | React Hook Form + Zod |
| Testes | Vitest (unitários e e2e) | Vitest + Testing Library |

**Arquitetura:**
- **Backend:** Clean Architecture + DDD. O domínio (entidades, use cases e contratos de repositório) não conhece banco, HTTP nem GraphQL. Detalhes em [`backend/architecture.md`](backend/architecture.md).
- **Frontend:** organizado por features. O estado do servidor fica no cache do Apollo, e os filtros e a paginação ficam na URL. Detalhes em [`frontend/architecture.md`](frontend/architecture.md).

## Como rodar

**Requisito:** Node.js 24, já fixado no `.nvmrc` de cada app. Com nvm: `nvm install && nvm use`. O banco é SQLite, gravado num arquivo local, então não precisa de Docker nem de banco instalado.

As duas aplicações rodam em **terminais separados**. Suba o backend primeiro.

### 1. Backend: `http://localhost:3333/graphql`

```bash
cd backend
nvm use
npm install                 # também gera o Prisma Client
cp .env.example .env        # preencha JWT_SECRET (ex.: openssl rand -hex 32)
npm run db:migrate          # cria o banco SQLite e aplica as migrations
npm run db:seed             # (opcional) usuário de demonstração com dados
npm run dev
```

| Variável | Exemplo |
|---|---|
| `PORT` | `3333` |
| `JWT_SECRET` | valor aleatório (obrigatório) |
| `DATABASE_URL` | `"file:./dev.db"` |
| `CORS_ORIGIN` | `http://localhost:5173` |

Abrir `http://localhost:3333/graphql` no navegador carrega o Apollo Sandbox para explorar a API.

### 2. Frontend: `http://localhost:5173`

```bash
cd frontend
nvm use
npm install
cp .env.example .env        # VITE_BACKEND_URL=http://localhost:3333/graphql
npm run dev
```

| Variável | Exemplo |
|---|---|
| `VITE_BACKEND_URL` | `http://localhost:3333/graphql` |

### Usuário de demonstração

Depois de rodar `npm run db:seed` no backend:

| E-mail | Senha |
|---|---|
| `conta@teste.com` | `12345678` |

Ou crie uma conta nova pela tela "Criar conta".

## Testes

```bash
# backend
cd backend
npm test              # unitários (use cases, com repositórios em memória)
npm run test:e2e      # e2e dos resolvers GraphQL (SQLite temporário, não toca no dev.db)

# frontend
cd frontend
npm test
```

## Documentação

| | Backend | Frontend |
|---|---|---|
| Como rodar em detalhe | [`docs/setup.md`](backend/docs/setup.md) | [`docs/setup.md`](frontend/docs/setup.md) |
| Arquitetura | [`architecture.md`](backend/architecture.md) | [`architecture.md`](frontend/architecture.md) |
| Contrato da API | [`docs/api-contract.md`](backend/docs/api-contract.md) | [`docs/api-contract.md`](frontend/docs/api-contract.md) |
| Decisões | [`docs/decisions/`](backend/docs/decisions/) | [`docs/decisions.md`](frontend/docs/decisions.md) |
| Design tokens | — | [`docs/design-tokens.md`](frontend/docs/design-tokens.md) |
