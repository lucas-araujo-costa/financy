# Arquitetura — Financy (frontend)

SPA em React 19 empacotada pelo Vite (sem framework), que consome a API GraphQL do backend. O código é organizado **por feature**: tudo o que é de uma tela fica perto dela, com uma fronteira pública (`index.ts`) entre features.

## Visão geral

```
Navegador
 └─ main.tsx
     └─ App (app/app.tsx)
         ├─ ApolloProvider ──────────────► Apollo Client (services/graphql)
         │                                   ├─ ErrorLink  (UNAUTHENTICATED → sai da conta)
         │                                   ├─ SetContextLink (Authorization: Bearer <token>)
         │                                   ├─ HttpLink   (VITE_BACKEND_URL)
         │                                   └─ InMemoryCache  ◄── estado do servidor
         ├─ RouterProvider (createBrowserRouter, modo biblioteca)
         │    ├─ "/"            HomeRoute → SignInPage (deslogado) | DashboardPage (logado)
         │    ├─ AuthLayout     /cadastro
         │    └─ AppLayout      /transacoes · /categorias · /perfil
         └─ Toaster (sonner)
```

## Camadas

```
Page                  features/<f>/pages/*.tsx        monta a tela, lê a URL, liga hooks e estado de UI
 ↓ props
Feature components    features/<f>/components/*       partes da tela (tabela, formulário, dialog)
 ↓ usa
UI / shared           components/ui · components/shared
Hooks                 features/<f>/hooks/use-*.ts     useQuery/useMutation + refetch + toast
 ↓
Services              features/<f>/services/*.ts      documentos GraphQL tipados (graphql() do codegen)
 ↓
Apollo Client         services/graphql/apollo-client.ts
 ↓ HTTP
Backend GraphQL       VITE_BACKEND_URL
```

| Pasta               | Responsabilidade                                                                                                          | Pode importar                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `components/ui`     | Design system do Style Guide (Button, TextInput, Select, Dialog, Table…). Sem regra de negócio                            | `lib/`, `hooks/`                                                                         |
| `components/shared` | Peças usadas por várias features e que conhecem o domínio (Header, CategoryIcon, Money, Pagination, ConfirmDeleteDialog…) | `ui/`, `lib/`, `services/`                                                               |
| `features/<f>`      | Uma área do produto: pages, components, hooks, services, schemas, types                                                   | `ui/`, `shared/`, `lib/`, `hooks/`, `services/` e **outras features só pelo `index.ts`** |
| `services/graphql`  | Cliente Apollo, normalização de erro (`ApiError`), `runMutation`, código gerado                                           | `lib/`                                                                                   |
| `lib/`              | Funções puras: formatação, token, movimento, view transition, `cn`                                                        | —                                                                                        |
| `hooks/`            | Hooks genéricos (`useDebouncedValue`, `usePresence`)                                                                      | `lib/`                                                                                   |

Features e o que cada uma expõe:

| Feature        | Telas                               | Exporta (`index.ts`)                                                                          |
| -------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| `auth`         | Login (`/`), Cadastro (`/cadastro`) | `useAuthToken`, `useSession`, `useSignOut`, páginas                                           |
| `profile`      | Perfil (`/perfil`)                  | `ProfilePage`                                                                                 |
| `dashboard`    | Dashboard (`/` logado)              | `DashboardPage`                                                                               |
| `transactions` | Transações (`/transacoes`)          | `TransactionsPage`, `TransactionFormDialog`, `useTransactions`, `useCreateTransaction`, tipos |
| `categories`   | Categorias (`/categorias`)          | `CategoriesPage`, `useCategories`, `getMostUsedCategories`, `formatItemsCount`, tipos         |

## Rotas

| Rota                        | Página                          | Layout                      | Observação                           |
| --------------------------- | ------------------------------- | --------------------------- | ------------------------------------ |
| `/`                         | `SignInPage` ou `DashboardPage` | `AuthLayout` ou `AppLayout` | `HomeRoute` escolhe pelo token       |
| `/cadastro`                 | `SignUpPage`                    | `AuthLayout`                |                                      |
| `/transacoes`               | `TransactionsPage`              | `AppLayout`                 | filtros e página na URL              |
| `/categorias`               | `CategoriesPage`                | `AppLayout`                 |                                      |
| `/perfil`                   | `ProfilePage`                   | `AppLayout`                 |                                      |
| `*`                         | `NotFound`                      | —                           |                                      |
| `/_dev/ui`, `/_dev/screens` | vitrines                        | —                           | só em desenvolvimento, fora do build |

`AppLayout` exige sessão: se o token some (logout ou sessão expirada), ele navega para `/` com View Transition. O `errorElement` da rota raiz é o `ErrorBoundary`.

## Sessão e autenticação

- O token fica em `lib/auth-token.ts`: **"Lembrar-me" marcado → `localStorage`, desmarcado → `sessionStorage`**. O cadastro não tem "Lembrar-me" e usa `sessionStorage`.
- `auth-token` é uma pequena store com `subscribe`. `useAuthToken()` lê com `useSyncExternalStore`, então layouts e a rota `/` reagem na hora em que o token entra ou sai.
- `SetContextLink` põe `Authorization: Bearer <token>` em toda requisição.
- `useSession()` roda a query `me` só quando há token. No login e no cadastro, o usuário devolvido é escrito no cache (`writeQuery`), então o header já nasce com as iniciais.
- **Sessão expirada:** o `ErrorLink` vê `UNAUTHENTICATED` em qualquer operação privada, limpa o token e o cache; o `AppLayout` leva para `/`. `Authenticate` e `Register` ficam de fora dessa regra, porque ali `UNAUTHENTICATED` significa senha errada e o erro é do formulário.
- **Sair da conta** (`useSignOut`): limpa token e cache (`clearStore`) e navega para `/` dentro de uma View Transition.

## Estado

| Tipo                | Onde vive                                               | Exemplo                                            |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| Estado do servidor  | cache do Apollo (`InMemoryCache`)                       | listas, perfil, resumo                             |
| Estado de UI        | `useState` no componente                                | dialog aberto, item em edição, item saindo         |
| Filtros e paginação | URL (`useSearchParams`)                                 | `?search=&type=&categoryId=&period=2025-11&page=2` |
| Sessão              | `localStorage`/`sessionStorage` + store de `auth-token` | token de acesso                                    |

Os filtros da URL passam por `transactionFiltersSchema` (Zod com `.catch`): valor inválido cai no padrão em vez de quebrar. Sem `period` na URL vale o mês atual; `period=all` busca todo o período.

## Cache e atualização depois de mutations

Toda operação tem nome. As mutations usam `refetchQueries` com esses nomes e `awaitRefetchQueries: true`:

| Mutation                               | Refaz                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| criar, editar ou excluir **transação** | `GetTransactions`, `GetFinancialSummary`, `GetCategories` (contagem e total mudam) |
| criar ou editar **categoria**          | `GetCategories`, `GetTransactions` (tag e ícone aparecem na tabela)                |
| excluir **categoria**                  | `GetCategories`                                                                    |
| editar **perfil**                      | nada: o `User` volta com `id` e o Apollo atualiza o cache                          |
| **sair da conta** / sessão expirada    | `client.clearStore()`                                                              |

## Um fluxo de ponta a ponta: editar uma transação

1. `TransactionTableRow` → clique no lápis → `TransactionsPage` guarda a transação em `editing` e abre o `TransactionFormDialog`.
2. O formulário (React Hook Form + `transactionFormSchema`) abre preenchido. O campo Valor trabalha em centavos; a data é um `Date` local escolhido no calendário.
3. Ao salvar, `useEditTransaction().edit(id, values)` converte com `toTransactionInput` (data → `YYYY-MM-DD`) e chama `editTransaction`.
4. `runMutation` espera a mutation e os refetches. Deu certo: toast "Transação atualizada.", a página fecha o dialog e a tabela já mostra o dado novo. Deu errado: toast com a mensagem em pt-BR do `extensions.code`, e o dialog continua aberto.

Excluir segue o mesmo caminho, com um passo a mais: a linha recebe `isRemoving`, sai com fade (`waitForExit()`, 200ms) e só então a mutation roda e o refetch reorganiza a lista.

## Erros

- `toApiError(error, mensagens?)` (`services/graphql/api-error.ts`) transforma qualquer erro do Apollo em `{ code, message }`. Os códigos vêm de `extensions.code` do backend: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_USER_INPUT`, `CONFLICT`, mais `NETWORK_ERROR` (servidor fora do ar) e `UNKNOWN`.
- Cada tela passa as mensagens específicas dela (ex.: `CONFLICT` no cadastro → "Este e-mail já está cadastrado.").
- Falha na **primeira carga** de uma query mostra `QueryErrorState` com "Tentar novamente" (`refetch`). Falha num refetch mantém os dados anteriores.
- Erros de validação ficam no próprio campo (`Field`), com animação de entrada e saída.

## Design system

- Tokens do Figma em `@theme` (`src/styles/global.css`). A paleta padrão do Tailwind está desligada; só existem as cores do Style Guide. Ver [`docs/design-tokens.md`](docs/design-tokens.md).
- `components/ui` parte dos componentes do shadcn/ui (Radix para acessibilidade e foco) e é **reestilizado com os tokens**, sem o visual padrão do shadcn.
- Componentes com mais de uma parte são compostos: `TextInput.Root / .Icon / .Field / .Action`. O estado "filled" do input vem do CSS (`:placeholder-shown`), por isso todo campo tem placeholder.
- Os 16 ícones e as 7 cores de categoria, com as classes de cada cor, ficam em `components/shared/category-style.ts`, usados por três features.

## Movimento

A regra completa está no [`AGENTS.md`](AGENTS.md#movimento-e-animações--regra-obrigatória). Onde ela está implementada:

| Peça                                                                      | Arquivo                                                                                   |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Tokens de duração e easing, crossfade de página, `prefers-reduced-motion` | `src/styles/global.css`                                                                   |
| Entrada e saída de dialog, select, popover                                | `components/ui/dialog.tsx`, `select.tsx`, `popover.tsx` (`data-state` + `tw-animate-css`) |
| Mensagem de erro que anima ao sair                                        | `components/ui/field.tsx` + `hooks/use-presence.ts`                                       |
| Troca de estado sem navegação (login → dashboard, logout)                 | `lib/view-transition.ts` (`withViewTransition`)                                           |
| Header parado na troca de página                                          | `components/shared/header.tsx` (`view-transition-name: app-header`)                       |
| Saída de item excluído                                                    | `lib/motion.ts` (`waitForExit`) + `isRemoving` nas linhas e cards                         |
| Dados anteriores durante refetch                                          | `features/transactions/hooks/use-transactions.ts` (`previousData`) + `isStale` na tabela  |
| Botão enviando                                                            | `components/ui/button.tsx` (`isLoading`)                                                  |

## Testes

| Tipo                   | Ferramenta               | O que cobre                                                                                                |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Unitário               | Vitest                   | `lib/format`, `lib/auth-token`, schemas Zod (login, cadastro, transação, filtros), cálculos das categorias |
| Componente             | Vitest + Testing Library | `Pagination`, `NavLink`, `SignInForm`, `TransactionTableFilters` (escreve na URL, com debounce)            |
| Integração com GraphQL | `MockedProvider`         | `SignInPage`: erro de credencial e login com sucesso                                                       |

`test/setup.ts` carrega os matchers do jest-dom, limpa o DOM entre testes e cria um stub de `ResizeObserver` (o jsdom não tem, e o Radix usa).
