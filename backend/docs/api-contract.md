# Contrato da API GraphQL

- **Endpoint:** `POST http://localhost:3333/graphql`, com `Content-Type: application/json`. O Apollo Sandbox abre em `GET /graphql` no navegador.
- **Autenticação:** `Authorization: Bearer <accessToken>`. O token vem de `register` ou `authenticate`, vale 7 dias e o `sub` é o id do usuário. **Todas as operações exigem token, menos `register` e `authenticate`.**
- **Fonte da verdade:** o código (TypeGraphQL, code-first). O frontend gera os tipos por introspecção deste endpoint. Mudou o schema? Atualize este arquivo e avise o frontend para rodar o `codegen` de novo.

## Convenções

- **Nomes:** um verbo por operação em todas as camadas (`editCategory` → `EditCategoryUseCase` → `edit-category.resolver.ts` → `EditCategory` no frontend).
- **Dinheiro:** inteiro em **centavos**, com o nome terminando em `InCents` (R$ 89,50 = `8950`). O valor da transação é sempre positivo, e o sinal vem de `type`.
- **Data da transação:** escalar `Date` no formato `"YYYY-MM-DD"`, sem hora nem fuso, na entrada e na saída. Datas inexistentes (`2025-11-31`) ou com hora são recusadas com `BAD_USER_INPUT`.
- **`createdAt`/`updatedAt`:** escalar `DateTimeISO` (`"2025-11-30T14:03:00.000Z"`).
- **Mês:** `month` vai de 1 a 12 e sempre vem junto com `year`.

## Schema

```graphql
# ─── Auth e perfil ──────────────────────────────────────────────
type Mutation {
  "Cria a conta e já devolve o token de acesso."
  register(input: RegisterInput!): AuthPayload!
  authenticate(input: AuthenticateInput!): AuthPayload!
  "Só o nome é editável: o e-mail não pode ser alterado."
  editProfile(input: EditProfileInput!): User!
}
type Query {
  "Usuário logado."
  me: User!
}

input RegisterInput     { name: String!  email: String!  password: String! }
input AuthenticateInput { email: String!  password: String! }
input EditProfileInput  { name: String! }

type AuthPayload { accessToken: String!  user: User! }
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTimeISO!
  updatedAt: DateTimeISO!
}

# ─── Categorias ─────────────────────────────────────────────────
type Query {
  "Categorias do usuário, em ordem de título, com estatísticas."
  categories: [Category!]!
}
type Mutation {
  createCategory(input: CategoryInput!): Category!
  editCategory(id: ID!, input: CategoryInput!): Category!
  "Falha com CONFLICT se a categoria tiver transações."
  deleteCategory(id: ID!): Boolean!
}

input CategoryInput {
  title: String!
  description: String       # opcional. Vazio ou só com espaços vira null
  icon: String!             # um dos 16 ícones (abaixo)
  color: String!            # uma das 7 cores (abaixo)
}

type Category {
  id: ID!
  title: String!
  description: String
  icon: String!
  color: String!
  transactionsCount: Int!   # transações da categoria, de todo o período
  totalInCents: Int!        # soma dos valores (entradas e saídas), de todo o período
  createdAt: DateTimeISO!
  updatedAt: DateTimeISO!
}

# ─── Transações ─────────────────────────────────────────────────
type Query {
  "Transações do usuário, da mais recente para a mais antiga."
  transactions(filter: TransactionsFilter, page: Int! = 1, perPage: Int! = 10): TransactionsPage!
}
type Mutation {
  createTransaction(input: TransactionInput!): Transaction!
  editTransaction(id: ID!, input: TransactionInput!): Transaction!
  deleteTransaction(id: ID!): Boolean!
}

input TransactionInput {
  description: String!
  amountInCents: Int!       # > 0
  type: TransactionType!
  date: Date!               # "YYYY-MM-DD"
  categoryId: ID!           # categoria do próprio usuário
}

input TransactionsFilter {
  search: String            # trecho da descrição. Ignora maiúsculas e acentos
  type: TransactionType
  categoryId: ID
  month: Int                # 1 a 12. Exige year
  year: Int                 # exige month
}

type TransactionsPage {
  items: [Transaction!]!
  total: Int!               # total de resultados com os filtros (para "1 a 10 | 27 resultados")
  page: Int!
  perPage: Int!             # 1 a 100
}

type Transaction {
  id: ID!
  description: String!
  amountInCents: Int!
  type: TransactionType!
  date: Date!
  category: TransactionCategory!
  createdAt: DateTimeISO!
  updatedAt: DateTimeISO!
}

"O que a tabela mostra da categoria (tag e ícone). Sem estatísticas."
type TransactionCategory { id: ID!  title: String!  icon: String!  color: String! }

"INCOME = Entrada (receita) · EXPENSE = Saída (despesa)"
enum TransactionType { INCOME  EXPENSE }

# ─── Dashboard ──────────────────────────────────────────────────
type Query {
  "Saldo de todo o período e entradas/saídas do mês pedido."
  financialSummary(month: Int!, year: Int!): FinancialSummary!
}

type FinancialSummary {
  balanceInCents: Int!        # entradas − saídas de todo o período. Pode ser negativo
  monthIncomeInCents: Int!
  monthExpenseInCents: Int!
}

scalar Date         # "YYYY-MM-DD"
scalar DateTimeISO  # ISO 8601 em UTC
```

### Valores aceitos em `icon` e `color`

Os valores vêm do modal "Nova categoria" do Figma e estão na mesma ordem dele.

- **`icon`** (nomes do Lucide):
  - linha 1: `briefcase-business`, `car-front`, `heart-pulse`, `piggy-bank`, `shopping-cart`, `ticket`, `tool-case`, `utensils`
  - linha 2: `paw-print`, `house`, `gift`, `dumbbell`, `book-open`, `baggage-claim`, `mailbox`, `receipt-text`
- **`color`:** `green`, `blue`, `purple`, `pink`, `red`, `orange`, `yellow`

Qualquer outro valor → `BAD_USER_INPUT`.

## Operações

| Campo GraphQL | Use case | Resolver | Operação no frontend |
|---|---|---|---|
| `register` | `RegisterUserUseCase` | `register.resolver.ts` | `Register` |
| `authenticate` | `AuthenticateUserUseCase` | `authenticate.resolver.ts` | `Authenticate` |
| `me` | `GetUserProfileUseCase` | `me.resolver.ts` | `GetMe` |
| `editProfile` | `EditUserProfileUseCase` | `edit-profile.resolver.ts` | `EditProfile` |
| `categories` | `FetchUserCategoriesUseCase` | `fetch-categories.resolver.ts` | `GetCategories` |
| `createCategory` | `CreateCategoryUseCase` | `create-category.resolver.ts` | `CreateCategory` |
| `editCategory` | `EditCategoryUseCase` | `edit-category.resolver.ts` | `EditCategory` |
| `deleteCategory` | `DeleteCategoryUseCase` | `delete-category.resolver.ts` | `DeleteCategory` |
| `transactions` | `FetchUserTransactionsUseCase` | `fetch-transactions.resolver.ts` | `GetTransactions` |
| `createTransaction` | `CreateTransactionUseCase` | `create-transaction.resolver.ts` | `CreateTransaction` |
| `editTransaction` | `EditTransactionUseCase` | `edit-transaction.resolver.ts` | `EditTransaction` |
| `deleteTransaction` | `DeleteTransactionUseCase` | `delete-transaction.resolver.ts` | `DeleteTransaction` |
| `financialSummary` | `GetFinancialSummaryUseCase` | `financial-summary.resolver.ts` | `GetFinancialSummary` |

## Regras de negócio

- **Isolamento:** cada usuário só lista, edita e exclui os próprios dados. Editar ou excluir o dado de outro usuário → `FORBIDDEN`. Um id que não existe → `NOT_FOUND`.
- **Conta:**
  - e-mail único, sem diferenciar maiúsculas;
  - senha de 8 a 72 caracteres;
  - login com e-mail ou senha errados devolve o mesmo erro (`UNAUTHENTICATED`).
- **Categoria:**
  - título único por usuário **sem diferenciar maiúsculas nem acentos** ("Saúde" e "saude" dão `CONFLICT`);
  - a própria categoria pode trocar só a caixa ("mercado" → "Mercado");
  - usuários diferentes podem ter títulos iguais;
  - **não pode ser excluída se tiver transações** (`CONFLICT`).
- **Transação:**
  - `amountInCents` inteiro e maior que zero;
  - a categoria precisa existir e ser do mesmo usuário (senão `NOT_FOUND` ou `FORBIDDEN`).
- **Listagem:** ordem por `date` decrescente e, no empate, por criação decrescente. A página de transações usa `perPage: 10` e as "Transações recentes" do dashboard usam `perPage: 5`.
- **Resumo:**
  - `balanceInCents` considera **todo o período**;
  - `monthIncomeInCents` e `monthExpenseInCents` consideram só o mês pedido.
- **Textos:** título, descrição e nome são gravados sem espaços nas pontas.

## Erros

Todo erro vem em `errors[]` com `extensions.code`:

| `extensions.code` | Quando |
|---|---|
| `UNAUTHENTICATED` | token ausente, inválido ou expirado; e-mail ou senha errados |
| `FORBIDDEN` | dado de outro usuário (editar, excluir ou usar a categoria dele) |
| `NOT_FOUND` | id inexistente |
| `CONFLICT` | e-mail já cadastrado, título de categoria repetido, categoria com transações |
| `BAD_USER_INPUT` | validação de campos, valor ≤ 0, data inválida, `month` sem `year`, `icon`/`color` fora da lista |
| `INTERNAL_SERVER_ERROR` | erro inesperado. A mensagem é genérica e o detalhe fica no log do servidor |

**Erro de validação** traz os campos em `extensions.validationErrors`, com mensagens em pt-BR:

```json
{
  "errors": [{
    "message": "Argument Validation Error",
    "extensions": {
      "code": "BAD_USER_INPUT",
      "validationErrors": [
        { "property": "email", "constraints": { "isEmail": "Informe um e-mail válido." } },
        { "property": "password", "constraints": { "minLength": "A senha deve ter no mínimo 8 caracteres." } }
      ]
    }
  }]
}
```

**Erro de negócio** traz a mensagem pronta para o usuário:

```json
{ "errors": [{ "message": "Você já tem uma categoria chamada \"SAUDE\".", "extensions": { "code": "CONFLICT" } }] }
```

## Exemplos

```graphql
mutation Authenticate {
  authenticate(input: { email: "conta@teste.com", password: "12345678" }) {
    accessToken
    user { id name email }
  }
}

query GetTransactions {
  transactions(filter: { search: "agua", type: EXPENSE, month: 11, year: 2025 }, page: 1, perPage: 10) {
    total page perPage
    items { id description amountInCents type date category { id title icon color } }
  }
}

mutation CreateTransaction {
  createTransaction(input: {
    description: "Jantar no Restaurante"
    amountInCents: 8950
    type: EXPENSE
    date: "2025-11-30"
    categoryId: "<id da categoria>"
  }) { id date category { title } }
}

query GetFinancialSummary {
  financialSummary(month: 11, year: 2025) { balanceInCents monthIncomeInCents monthExpenseInCents }
}
```
