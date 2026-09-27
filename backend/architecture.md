# Arquitetura do backend

API GraphQL em TypeScript organizada em **Clean Architecture** com **DDD**: as regras de negócio ficam isoladas no domínio e a infraestrutura (HTTP, GraphQL, banco, criptografia) se liga a ele por contratos.

## Camadas

```
┌──────────────────────────── infra ─────────────────────────────┐
│ Fastify · Apollo Server · TypeGraphQL · Prisma · bcrypt · JWT  │
│ resolvers → factories → use cases     presenters ← read models │
└───────────────────────────────┬────────────────────────────────┘
                                │ implementa os contratos
┌───────────────────── domain/application ───────────────────────┐
│ use cases (Either) · contratos de repositório e criptografia   │
│ erros de negócio                                               │
└───────────────────────────────┬────────────────────────────────┘
┌───────────────────── domain/enterprise ────────────────────────┐
│ entidades (User, Category, Transaction) · read models          │
│ tipos (cores, ícones, tipo, período)                           │
└───────────────────────────────┬────────────────────────────────┘
┌──────────────────────────── core ──────────────────────────────┐
│ Either · Entity · ValueObject · UniqueEntityID · normalizeText │
│ NotAllowedError · ResourceNotFoundError · paginação            │
└────────────────────────────────────────────────────────────────┘
```

- **`core/`**: peças genéricas, sem nada do Financy.
- **`domain/`**: dois contextos.
  - **`identity`** (conta do usuário: cadastro, login, perfil).
  - **`finance`** (categorias, transações e resumo).
  - O domínio não conhece banco, HTTP nem GraphQL. Ele declara **contratos** (`UsersRepository`, `HashGenerator`, `Encrypter`…) como classes abstratas, e a infra fornece as implementações.
- **`infra/`**: tudo que fala com o mundo externo.
  - Os **resolvers** fazem o papel de controllers.
  - As **factories** montam os use cases com as implementações reais. É injeção de dependência manual, sem container.
  - Os **presenters** convertem entidades e read models nos tipos GraphQL.

**Regra de dependência:** as setas só apontam para dentro. `domain/` importa só de `core/` e de si mesmo.

## Uma requisição de ponta a ponta: `editCategory`

```
POST /graphql  (Authorization: Bearer <jwt>)
  │
  ├─ Fastify + @fastify/cors
  ├─ Apollo (@as-integrations/fastify) → buildContext: jwtVerify() → { userId }
  ├─ TypeGraphQL
  │    ├─ @Authorized() → authChecker: sem userId → UNAUTHENTICATED
  │    └─ class-validator em CategoryInput → BAD_USER_INPUT
  │
  ├─ EditCategoryResolver
  │    └─ makeEditCategoryUseCase() → new EditCategoryUseCase(new PrismaCategoriesRepository(prisma))
  │
  ├─ EditCategoryUseCase.execute({ userId, categoryId, title, … })
  │    ├─ findById            → não existe?          left(ResourceNotFoundError)
  │    ├─ category.userId     → é de outro usuário?  left(NotAllowedError)
  │    ├─ findByTitle         → título normalizado já usado por outra? left(CategoryAlreadyExistsError)
  │    ├─ setters (touch)     → save
  │    └─ findWithStatsById   → right({ category: CategoryWithStats })
  │
  └─ Resolver
       ├─ Left  → toGraphQLError → NOT_FOUND | FORBIDDEN | CONFLICT
       └─ Right → CategoryPresenter.toGraphQL → type Category
```

Toda operação segue esse mesmo desenho, e a tabela operação → use case → resolver está em [`docs/api-contract.md`](docs/api-contract.md).

## Autenticação e isolamento

- **Cadastro e login** devolvem um JWT (`@fastify/jwt`) com `sub` = id do usuário, válido por 7 dias. A senha vira hash com bcrypt (`bcryptjs`, custo 10) e nunca aparece no schema.
- **Contexto:** a cada requisição, `buildContext` tenta `request.jwtVerify()`. Se o token for válido, o `userId` entra no contexto. Se não houver token, ou ele for inválido ou estiver expirado, a requisição segue sem usuário, e o `@Authorized()` barra o que exige login com `UNAUTHENTICATED`.
- **Isolamento:**
  - As listagens filtram por `userId` no repositório.
  - Editar e excluir buscam por id e comparam o dono no use case (`NotAllowedError` → `FORBIDDEN`).
  - Criar ou editar transação também confere se a categoria é do mesmo usuário.
- **E-mail** é gravado sem espaços nas pontas e em minúsculas. Login com e-mail inexistente e login com senha errada devolvem o mesmo erro (`WrongCredentialsError` → `UNAUTHENTICATED`), para não revelar quais e-mails têm conta.

## Erros

| Origem | `extensions.code` |
|---|---|
| `WrongCredentialsError`, token ausente/inválido | `UNAUTHENTICATED` |
| `NotAllowedError` | `FORBIDDEN` |
| `ResourceNotFoundError` | `NOT_FOUND` |
| `UserAlreadyExistsError`, `CategoryAlreadyExistsError`, `CategoryHasTransactionsError` | `CONFLICT` |
| `InvalidTransactionAmountError`, validação do class-validator, escalar inválido | `BAD_USER_INPUT` |
| qualquer outra coisa (bug, banco fora do ar) | `INTERNAL_SERVER_ERROR` |

- **Erros de negócio** saem dos use cases como `Left`, nunca como exceção.
- **Erro inesperado:** o `formatError` do Apollo registra o erro no log e devolve só uma mensagem genérica, sem vazar detalhes internos.
- **Validação:** o erro traz `extensions.validationErrors[]` com as mensagens por campo em pt-BR.

## Persistência

- **Prisma 7 + SQLite** com o driver adapter `better-sqlite3`.
  - A configuração fica em `prisma.config.ts`, que lê o `.env` com `process.loadEnvFile()` do Node 24.
  - O client é gerado em `src/infra/database/prisma/generated/`, fora do git.
- **Mappers** convertem entre o formato do Prisma e as entidades do domínio. **Repositórios Prisma** implementam os contratos do domínio.
- **IDs:** UUID, gerados no domínio (`UniqueEntityID`).
- **Regras refletidas no banco:**
  - `@@unique([userId, normalizedTitle])`: garante o título único por usuário, sem diferenciar caixa nem acento.
  - `normalizedDescription`: a busca usa essa coluna, porque o `LIKE` do SQLite só ignora maiúsculas em ASCII.
  - `onDelete: Restrict` na categoria da transação: impede apagar categoria com transações (a regra também é checada no use case).
  - `onDelete: Cascade` nos dados do usuário.
- **Read models** (`value-objects/`) atendem o que as telas mostram sem expor detalhes do banco:
  - `CategoryWithStats` = categoria + `transactionsCount` + `totalInCents` (agregação `groupBy`);
  - `TransactionWithCategory` = transação + título, ícone e cor da categoria;
  - `FinancialSummary` = saldo de todo o período + entradas e saídas do mês.
- **Datas:** a transação guarda um dia do calendário como meia-noite UTC. O filtro de mês e o resumo usam o intervalo `[1º dia, 1º dia do mês seguinte)` em UTC (`getPeriodRange`).

## Testes

| Tipo | Onde | Como |
|---|---|---|
| Unitário | `*.spec.ts` ao lado de cada use case e do `core` | repositórios em memória (`test/repositories`), factories com faker (`test/factories`), `FakeHasher`/`FakeEncrypter` |
| E2E | `*.e2e-spec.ts` ao lado de cada resolver | app real via `app.inject` do Fastify, com um SQLite novo por arquivo no diretório temporário, `prisma migrate deploy` e remoção no fim (`test/setup-e2e.ts`) |

Os repositórios em memória reproduzem o comportamento dos repositórios Prisma (ordenação, normalização, paginação, agregações), para que as regras testadas no unitário valham no banco real.

## Decisões

As decisões e seus motivos estão em [`docs/decisions/`](docs/decisions/).
