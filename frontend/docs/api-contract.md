# Contrato da API (visão do frontend)

O frontend consome a API GraphQL do backend em `VITE_BACKEND_URL`. A fonte da verdade é o **schema do backend**; os tipos usados aqui são gerados dele (`npm run codegen` → `src/services/graphql/generated/`). Este documento resume o que o frontend usa e as convenções que ele depende.

## Convenções

- **Dinheiro:** inteiro em centavos, sempre positivo. Os campos terminam em `InCents` (R$ 89,50 = `8950`). O sinal vem do `type` da transação.
- **Tipo da transação:** `INCOME` (Entrada/Receita) ou `EXPENSE` (Saída/Despesa).
- **Data da transação:** escalar `Date`, **dia do calendário** no formato `YYYY-MM-DD`. O frontend converte com `toCalendarDate`/`fromCalendarDate` e formata em UTC, para o dia não mudar com o fuso.
- **Datas de auditoria** (`createdAt`, `updatedAt`): escalar `DateTimeISO` (ISO 8601). O frontend não usa.
- **Ícone e cor da categoria:** strings de listas fixas (abaixo). Um valor fora da lista cai no primeiro da lista ao exibir.
- **Autenticação:** `Authorization: Bearer <accessToken>` em toda operação, menos `register` e `authenticate`.

## Operações

Um nome por operação em todas as camadas: campo GraphQL → operação no front → hook.

| Campo GraphQL       | Operação (arquivo em `services/`) | Hook                   | Usado em                         |
| ------------------- | --------------------------------- | ---------------------- | -------------------------------- |
| `register`          | `Register`                        | `useRegister`          | Cadastro                         |
| `authenticate`      | `Authenticate`                    | `useAuthenticate`      | Login                            |
| `me`                | `GetMe`                           | `useSession`           | Header, Perfil                   |
| `editProfile`       | `EditProfile`                     | `useEditProfile`       | Perfil                           |
| `categories`        | `GetCategories`                   | `useCategories`        | Categorias, Dashboard, selects   |
| `createCategory`    | `CreateCategory`                  | `useCreateCategory`    | Categorias                       |
| `editCategory`      | `EditCategory`                    | `useEditCategory`      | Categorias                       |
| `deleteCategory`    | `DeleteCategory`                  | `useDeleteCategory`    | Categorias                       |
| `transactions`      | `GetTransactions`                 | `useTransactions`      | Transações, Dashboard (recentes) |
| `createTransaction` | `CreateTransaction`               | `useCreateTransaction` | Transações, Dashboard            |
| `editTransaction`   | `EditTransaction`                 | `useEditTransaction`   | Transações                       |
| `deleteTransaction` | `DeleteTransaction`               | `useDeleteTransaction` | Transações                       |
| `financialSummary`  | `GetFinancialSummary`             | `useFinancialSummary`  | Dashboard                        |

### Auth e perfil

```graphql
mutation Register($input: RegisterInput!)           # { name, email, password } → AuthPayload
mutation Authenticate($input: AuthenticateInput!)   # { email, password }       → AuthPayload
query    GetMe                                      # → User { id, name, email }
mutation EditProfile($input: EditProfileInput!)     # { name } → User  (o e-mail não pode ser alterado)
```

`AuthPayload` = `{ accessToken, user { id, name, email } }`. O cadastro já devolve o token e o usuário entra direto.

### Categorias

```graphql
query GetCategories   # [Category] em ordem de título
# Category: id, title, description?, icon, color, transactionsCount, totalInCents

mutation CreateCategory($input: CategoryInput!)
mutation EditCategory($id: ID!, $input: CategoryInput!)
mutation DeleteCategory($id: ID!)   # CONFLICT se a categoria tiver transações
# CategoryInput: { title, description?, icon, color }
```

`transactionsCount` e `totalInCents` são de todo o período. Os cards "Total de categorias", "Total de transações", "Categoria mais utilizada" e o card de categorias do dashboard são calculados no frontend a partir dessa lista (`features/categories/utils/categories-stats.ts`).

### Transações

```graphql
query GetTransactions($filter: TransactionsFilter, $page: Int!, $perPage: Int!)
# → TransactionsPage { items, total, page, perPage }, da mais recente para a mais antiga
# Transaction: id, description, amountInCents, type, date, category { id, title, icon, color }
# TransactionsFilter: { search?, type?, categoryId?, month?, year? }   (month e year andam juntos)

mutation CreateTransaction($input: TransactionInput!)
mutation EditTransaction($id: ID!, $input: TransactionInput!)
mutation DeleteTransaction($id: ID!)
# TransactionInput: { description, amountInCents, type, date, categoryId }
```

- Página de Transações: `perPage: 10`, filtros vindos da URL (`toTransactionsVariables`). Sem período na URL → mês atual; `period=all` → sem `month`/`year`.
- Dashboard, "Transações recentes": `page: 1, perPage: 5`, sem filtro.
- `search` ignora maiúsculas e acentos (feito no backend).

### Resumo do dashboard

```graphql
query GetFinancialSummary($month: Int!, $year: Int!)
# → { balanceInCents, monthIncomeInCents, monthExpenseInCents }
```

`balanceInCents` é de todo o período e pode ser negativo; receitas e despesas são do mês pedido (o dashboard pede o mês atual).

## Listas fixas

**16 ícones** (nomes do Lucide, na ordem da grade 8×2 do modal "Nova categoria"):
`briefcase-business`, `car-front`, `heart-pulse`, `piggy-bank`, `shopping-cart`, `ticket`, `tool-case`, `utensils`, `paw-print`, `house`, `gift`, `dumbbell`, `book-open`, `baggage-claim`, `mailbox`, `receipt-text`

**7 cores** (na ordem do picker): `green`, `blue`, `purple`, `pink`, `red`, `orange`, `yellow`

O backend recusa qualquer outro valor com `BAD_USER_INPUT`. No frontend, as listas e o mapeamento para componente Lucide e classes do tema ficam em `src/components/shared/category-style.ts`. O modal de categoria já abre com o primeiro ícone e a primeira cor selecionados.

## Erros

Os erros vêm em `errors[].extensions.code` e são normalizados por `toApiError` (`services/graphql/api-error.ts`).

| Código            | Quando                                                  | Mensagem na tela                                         |
| ----------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `UNAUTHENTICATED` | login com e-mail ou senha errados                       | "E-mail ou senha incorretos."                            |
| `UNAUTHENTICATED` | token ausente, inválido ou expirado em operação privada | sai da conta e volta para o login                        |
| `FORBIDDEN`       | recurso de outro usuário                                | "Você não tem permissão para fazer isso."                |
| `NOT_FOUND`       | recurso não existe                                      | "O registro não foi encontrado."                         |
| `BAD_USER_INPUT`  | validação do backend                                    | "Confira os dados informados."                           |
| `CONFLICT`        | e-mail já cadastrado                                    | "Este e-mail já está cadastrado."                        |
| `CONFLICT`        | título de categoria repetido                            | "Já existe uma categoria com esse título."               |
| `CONFLICT`        | excluir categoria com transações                        | "Essa categoria tem transações e não pode ser excluída." |
| — (rede)          | backend fora do ar                                      | "Não foi possível conectar ao servidor."                 |

O login usa a mesma mensagem para e-mail inexistente e senha errada, para não revelar quais e-mails têm conta.
