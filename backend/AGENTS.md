# AGENTS.md: backend do Financy

Guia para agentes de IA (e pessoas) que vão mexer nesta pasta. Leia antes de alterar qualquer arquivo.

- **O que é:** API GraphQL de finanças pessoais: contas, categorias e transações. Cada usuário só vê e altera os próprios dados.
- **Onde roda:** `http://localhost:3333/graphql`. O frontend fica em `../frontend` e é um app **independente**: os dois só conversam pelo contrato GraphQL via HTTP. Nunca importe nada de lá, nem de cá para lá.
- **Documentos:** [`architecture.md`](architecture.md) (camadas e fluxo), [`docs/setup.md`](docs/setup.md) (como rodar), [`docs/api-contract.md`](docs/api-contract.md) (contrato) e [`docs/decisions/`](docs/decisions/) (ADRs).

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala e roda `prisma generate` (postinstall) |
| `npm run dev` | servidor com reload (`tsx watch`), lendo o `.env` |
| `npm run build` / `npm start` | build com `tsup` em `dist/` e execução do build |
| `npm test` | testes unitários (use cases, em memória) |
| `npm run test:e2e` | testes e2e dos resolvers (SQLite temporário por arquivo) |
| `npm run test:cov` | cobertura de `core/` e `domain/` |
| `npm run lint` | ESLint (`@rocketseat/eslint-config`) |
| `npx tsc --noEmit` | checagem de tipos (tsx, tsup e Vitest **não** checam tipos) |
| `npm run db:migrate` / `db:seed` / `db:studio` / `db:generate` | Prisma |

**Antes de dizer que terminou:** `npm run lint`, `npx tsc --noEmit`, `npm test` e `npm run test:e2e`, todos verdes.

## Arquitetura em uma tela

```
src/
├── core/      Either, Entity, ValueObject, UniqueEntityID, erros base, normalizeText
├── domain/    regras de negócio puras (não conhece banco, HTTP nem GraphQL)
│   ├── identity/  usuário: cadastro, login, perfil
│   └── finance/   categorias, transações, resumo
│       ├── enterprise/   entidades, tipos (cores, ícones, período), read models
│       └── application/  contratos de repositório, use cases, erros
└── infra/     o mundo externo: Fastify, Apollo, TypeGraphQL, Prisma, bcrypt, JWT
test/          factories (faker), repositórios em memória, fakes de criptografia, helpers e2e
prisma/        schema, migrations, seed
```

**Regra de dependência:** `infra → domain/application → domain/enterprise → core`. O `domain/` só importa de `core/` e de si mesmo. Se você precisou importar Prisma, Fastify, `graphql` ou `type-graphql` dentro de `domain/`, o código está na camada errada.

## Convenções obrigatórias

### Nomes
- **Um verbo por operação em todas as camadas:** campo GraphQL `editCategory` → `EditCategoryUseCase` (`edit-category.ts`) → `makeEditCategoryUseCase` → `edit-category.resolver.ts` → operação `EditCategory` no frontend. Leituras usam `fetch` (listas) e `get` (um item).
- Arquivos em `kebab-case`. Identificadores de código em inglês. Comentários, mensagens de erro e docs em **português do Brasil**.
- Tipos GraphQL de infra terminam em `Type` (`CategoryType`), mas o nome no schema é o do domínio (`@ObjectType('Category')`).

### Use cases
- Um use case por operação, com `execute(request)` e retorno `Either<Erro, Sucesso>` (`left`/`right` de `core/either`). **Nunca** lance exceção para erro de negócio.
- **Editar ou excluir:** busque por id → `ResourceNotFoundError` se não achar → `NotAllowedError` se for de outro usuário → aplique os setters da entidade (que chamam `touch()`) → `save`.
- Erro de negócio novo: crie a classe em `application/use-cases/errors/`, implemente `UseCaseError` e **registre o código** em `infra/graphql/errors/to-graphql-error.ts`. Um erro sem código mapeado vira `INTERNAL_SERVER_ERROR`.
- Mutations de criar e editar devolvem o **read model** (`CategoryWithStats`, `TransactionWithCategory`), não a entidade (ADR 0008).

### Dados
- **Dinheiro:** sempre inteiro em **centavos**, e o nome termina em `InCents`. O valor é sempre positivo e o sinal vem de `type` (`INCOME`/`EXPENSE`).
- **Data da transação:** um dia do calendário, no escalar `Date` (`"YYYY-MM-DD"`), gravado como meia-noite UTC. Intervalos de mês usam `getPeriodRange` (UTC).
- **Título de categoria e busca:** compare sempre pela forma normalizada (`normalizeText`: sem acento, minúsculas e espaços colapsados). No banco isso vira as colunas `normalizedTitle` e `normalizedDescription`, que são preenchidas pelos getters das entidades.
- **`icon` e `color`:** só os valores das listas fixas em `domain/finance/enterprise/types/` (16 ícones Lucide e 7 cores do Figma).

### GraphQL (TypeGraphQL)
- **Todo `@Field`, `@Arg` e retorno de `@Query`/`@Mutation` leva o tipo explícito:** `@Field(() => String)`, `@Arg('id', () => ID)`. O tsx, o tsup e o Vitest não emitem `emitDecoratorMetadata`.
- `import 'reflect-metadata'` fica na **primeira linha** de qualquer ponto de entrada que carregue o schema (`app.ts`, `seed.ts`, `test/setup-e2e.ts`).
- Resolver protegido: `@Authorized()` + `@CurrentUserId() userId: string`. Só `register` e `authenticate` são públicos.
- Resolver só faz: validar a entrada (class-validator no input) → chamar a factory → executar o use case → `toGraphQLError` no `Left` → presenter no `Right`. Regra de negócio não entra no resolver.
- Validação de entrada com class-validator no `@InputType`/`@ArgsType`, com mensagem em pt-BR.

### Testes
- **Todo use case tem `.spec.ts` ao lado**, com repositórios em memória (`test/repositories`) e factories `make-*` (`test/factories`). Cubra o caminho feliz e **cada** `Left`, inclusive o de dado de outro usuário.
- **Todo resolver tem `.e2e-spec.ts` ao lado.** Use os helpers de `test/e2e/` (`graphqlRequest`, `createAndAuthenticateUser`, `createCategory`, `createTransaction`). Cada arquivo e2e roda num SQLite próprio. Não dependa de ordem entre arquivos.
- Os repositórios em memória precisam se comportar como os do Prisma (ordenação, normalização, paginação). Mudou um, mude o outro.

### Estilo
- Lint com limite de 80 colunas (a regra só ignora linhas `} from '...'`). Quebre objetos e assinaturas em várias linhas em vez de desligar a regra.
- `import type` para o que é só tipo (`verbatimModuleSyntax`).
- Alias: `@/` → `src/` e `test/` → `test/`.

## Checklist: nova operação da API

1. Use case em `domain/<contexto>/application/use-cases/` com `.spec.ts`, e erros novos em `errors/`.
2. Se precisar, método novo no contrato do repositório, implementado no Prisma **e** no repositório em memória.
3. Factory `make-<verbo>-<coisa>-use-case.ts` em `infra/factories/`.
4. Input/args (class-validator), object type e presenter, se forem novos.
5. Resolver `<verbo>-<coisa>.resolver.ts`, registrado em `infra/graphql/schema.ts`, e `.e2e-spec.ts`.
6. Código de erro em `to-graphql-error.ts` se houver erro novo.
7. Atualizar [`docs/api-contract.md`](docs/api-contract.md) e avisar quem mantém o frontend (ele gera os tipos por introspecção com o `codegen`).

## Não faça

- **Não adicione dependência** sem aprovação de quem mantém o projeto. Não basta um exemplo usar a biblioteca: cada ferramenta precisa de um motivo técnico ou de requisito.
- **Não atualize** estas versões sem avaliar antes (motivos na ADR 0009):
  - TypeScript: fica no 6.x, porque o 7 quebra o `typescript-eslint`.
  - `graphql`: fica no 16.x, porque o 17 quebra o TypeGraphQL 2 e o Apollo 5.
  - Prisma: fica no 7.x, porque o 8 ainda é RC.
  - `@rocketseat/eslint-config`: fica no 3.0.12.
- Não edite `src/infra/database/prisma/generated/`: ele é gerado (`npm run db:generate`) e fica fora do git.
- Não versione `.env`, `*.db`, `dist/` nem `coverage/`.
- Não rode `git init` aqui: o repositório é um só, na pasta acima. Faça commit só de `backend/` (`git add backend/`).
