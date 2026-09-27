# AGENTS.md — Financy (frontend)

Guia para agentes de IA (e pessoas) que vão mexer neste app. Leia inteiro antes de editar.

- Arquitetura: [`architecture.md`](architecture.md)
- Setup e scripts: [`docs/setup.md`](docs/setup.md)
- Contrato da API: [`docs/api-contract.md`](docs/api-contract.md)
- Design tokens e Figma: [`docs/design-tokens.md`](docs/design-tokens.md)
- Decisões e o porquê delas: [`docs/decisions.md`](docs/decisions.md)

## O que é

Aplicação React do Financy (gestão de finanças pessoais): login e cadastro, dashboard, transações, categorias e perfil. Conversa com o backend **só pelo contrato GraphQL via HTTP** (`VITE_BACKEND_URL`). Nada é importado da pasta do backend.

## Stack (fechada)

| Item                         | Escolha                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| Bundler                      | Vite, **sem framework**                                                     |
| UI                           | React 19 + TypeScript 6 (strict)                                            |
| GraphQL e estado do servidor | Apollo Client 4 + GraphQL Codegen (client preset)                           |
| Rotas                        | React Router 7 em **modo biblioteca** (`createBrowserRouter`)               |
| Estilo                       | Tailwind CSS v4 (`@theme`) + componentes do shadcn/ui (Radix) reestilizados |
| Formulários                  | React Hook Form + Zod                                                       |
| Ícones                       | lucide-react                                                                |
| Toasts                       | sonner                                                                      |
| Datas e moeda                | `Intl` nativo (sem biblioteca)                                              |
| Testes                       | Vitest + Testing Library + `MockedProvider` do Apollo                       |
| Lint e formatação            | ESLint 9 (`@rocketseat/eslint-config`) + Prettier com plugin do Tailwind    |

**Nenhuma dependência nova entra sem aprovação do dono do projeto.** "Um exemplo usa" não é motivo. Antes de propor, confira se a stack já resolve (ver [`docs/decisions.md`](docs/decisions.md): `date-fns`, fontsource, `clsx`/`tailwind-merge` e bibliotecas de animação foram recusados de propósito).

## Comandos

```bash
nvm use                # Node 24 (.nvmrc). Em shell não interativo: . "$NVM_DIR/nvm.sh" && nvm use
npm install
npm run dev            # http://localhost:5173 (o backend precisa estar no ar)
npm run codegen        # regenera os tipos a partir do schema do backend
npm run lint
npm run format         # Prettier (ordena as classes do Tailwind)
npm test               # Vitest
npm run build          # tsc -b + vite build
```

**Antes de dar uma tarefa por terminada:** `npm run format:check && npm run lint && npx tsc -b && npm test && npm run build`, tudo verde.

## Estrutura e fronteiras

```
src/
├── app/            providers, router, layouts, rota "/"
├── components/ui/      design system (Style Guide do Figma). Não conhece o domínio
├── components/shared/  usados por várias features. Pode conhecer o domínio
├── features/<f>/   pages · components · hooks · services · schemas · types · index.ts
├── services/graphql/   Apollo Client, ApiError, runMutation, generated/ (codegen)
├── hooks/          hooks genéricos, sem domínio
├── lib/            funções puras: format, auth-token, motion, view-transition, utils
└── styles/global.css   Tailwind + tokens (@theme)
```

Regras:

1. **Uma feature só importa outra pelo `index.ts` público dela** (`@/features/transactions`), nunca por caminho interno.
2. **`components/ui` não sabe o que é transação ou categoria.** Se precisa saber, vai para `components/shared` ou para a feature.
3. **Página monta a tela e liga os hooks; componentes recebem dados por props.** Componentes de feature não chamam `useQuery`/`useMutation` direto: isso fica nos hooks.
4. **Um arquivo por operação GraphQL** em `features/<f>/services/`, com o documento dentro de `graphql()` do codegen. **Um hook por operação** em `features/<f>/hooks/`.
5. Import com o alias `@/` (→ `src/`). Dentro da própria feature, caminho relativo.

## Estado

- **Estado do servidor vive só no cache do Apollo.** Nunca copie dados de query para `useState` ou para uma store.
- **Estado de UI** (dialog aberto, item em edição) é local no componente.
- **Filtros e paginação ficam na URL** (`useTransactionFilters`). Mudar filtro volta para a página 1.
- Depois de uma mutation, refaça as queries afetadas com `refetchQueries` + `awaitRefetchQueries` (tabela em [`architecture.md`](architecture.md#cache-e-atualização-depois-de-mutations)).
- Mutations passam por `runMutation` (`services/graphql/run-mutation.ts`), que mostra o toast e devolve `true`/`false` para a tela fechar o dialog.

## Contrato da API

- **Nunca escreva à mão tipos de resposta da API.** Eles vêm de `src/services/graphql/generated/` (gerado e versionado). As interfaces em `features/<f>/types.ts` são **props de exibição** com os mesmos nomes do contrato, para o tipo gerado encaixar sem conversão.
- Não invente campo. Se faltar algo no schema, peça para o backend.
- Contrato mudou? `npm run codegen` e siga os erros do `tsc`.
- Dinheiro é sempre **inteiro em centavos** (campos terminam em `InCents`). Datas de transação são **dia do calendário** `YYYY-MM-DD`. Use as funções de `lib/format.ts`, nunca `toLocaleString` solto.

## Estilo e design system

- **Só tokens.** Cores, fonte e movimento estão em `@theme` (`src/styles/global.css`). A paleta padrão do Tailwind está desligada: `bg-blue-500` não existe, `bg-blue-light` existe. Nada de hex solto em componente.
- Siga o Figma o mais fielmente possível ([`docs/design-tokens.md`](docs/design-tokens.md)). Todos os estados do Style Guide (empty, active, filled, error, disabled, hover) precisam existir.
- Componentes vindos do shadcn são **reescritos com os tokens**. Ao rodar `npx shadcn add ...`, revise o arquivo inteiro e desinstale dependências que o componente não importa (ex.: o `calendar` instala `date-fns`, que não usamos).
- Classes condicionais com `cn()` (`@/lib/utils`). Variantes com `cva`.
- Acessibilidade: `IconButton` exige `aria-label`; campos ligam label, `aria-invalid` e `aria-describedby` (o `Field` gera o id `<campo>-message`).

## Movimento e animações — REGRA OBRIGATÓRIA

O Figma não define animações; esta regra define. **Vale para o site inteiro: nenhuma mudança visual "seca".** Nada aparece, some, troca de tela ou muda de estado sem transição.

**Ferramentas (sem biblioteca de animação extra):**

| O quê                                      | Com o quê                                                                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Cor, borda, sombra, opacidade              | `transition-*` do Tailwind + `duration-fast/base/slow` + `ease-out/ease-in`                                                                    |
| Entrada e saída de dialog, select, popover | `tw-animate-css` com o `data-state` do Radix (`data-[state=open]:animate-in` …)                                                                |
| Skeleton                                   | `animate-pulse` (componente `Skeleton`)                                                                                                        |
| Troca de página                            | View Transitions: `<Link viewTransition>`, `navigate(to, { viewTransition: true })`, `withViewTransition()` para troca de estado sem navegação |
| Toasts                                     | animação nativa do sonner                                                                                                                      |

**Tokens (use sempre estes, nunca `duration-150` solto):**

| Token           | Valor                           | Uso                                                                    |
| --------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `duration-fast` | 150ms                           | hover, foco, cor de borda, troca de ícone, saídas                      |
| `duration-base` | 200ms                           | dialogs, dropdowns, toggles, mensagens de erro, saída de item excluído |
| `duration-slow` | 300ms                           | troca de página, entrada de conteúdo depois do loading                 |
| `ease-out`      | `cubic-bezier(0.16, 1, 0.3, 1)` | entradas                                                               |
| `ease-in`       | `cubic-bezier(0.7, 0, 0.84, 0)` | saídas (mais curtas que as entradas)                                   |

**Comportamento esperado:**

- **Carregando:** skeleton com **o mesmo formato e a mesma altura** do conteúdo final. Nada de spinner solto nem tela em branco. O conteúdo entra com fade (`animate-in fade-in-0 duration-slow`).
- **Refetch, filtro e paginação:** os dados anteriores ficam na tela (`previousData`) com opacidade reduzida. A tabela não desmonta nem pula de altura.
- **Botão enviando:** `isLoading` do `Button` (spinner, texto mantido, largura fixa).
- **Dialogs:** overlay com fade; conteúdo com fade + zoom 95% → 100%; **a saída também anima**.
- **Select, popover, date picker:** fade + deslize curto a partir do lado em que abre.
- **Campos:** borda e cor transicionam no foco, hover e erro; a mensagem de erro entra e sai com fade + deslize (`Field` + `usePresence`).
- **Seleção** (toggle Despesa/Receita, pickers de ícone e cor, nav do header): fundo e borda transicionam.
- **Listas:** item novo entra com fade; item excluído **sai com fade antes** de o refetch reorganizar a lista (`waitForExit()` de `lib/motion.ts`).
- **Troca de página:** crossfade do miolo; o header tem `view-transition-name: app-header` e fica parado. Vale também para login → dashboard e logout.

**Regras gerais:**

- Anime só `opacity` e `transform` em entradas e saídas. Nunca `width`, `height`, `top` ou `left`.
- Sem layout shift: skeleton e conteúdo ocupam o mesmo espaço.
- **Nada passa de 300ms.**
- `prefers-reduced-motion: reduce`: deslocamentos e zooms são anulados em `global.css` e fica só o fade. Não crie animação que dependa de movimento para fazer sentido.

Se aparecer uma necessidade que CSS e View Transitions não resolvem, **peça aprovação** antes de trazer uma biblioteca (ex.: Motion).

## Formulários

- React Hook Form + `zodResolver`. O schema fica em `features/<f>/schemas/` e tem teste.
- Mensagens de validação em pt-BR, no schema.
- Conversão para o input do contrato em função pura ao lado do schema (`toTransactionInput`, `toCategoryInput`).
- Erros da API viram mensagem em pt-BR por `extensions.code` (`toApiError`), com mensagens específicas da tela passadas para `runMutation`.

## Testes

- Vitest com `globals: false`: importe `describe`, `it`, `expect` e `vi` de `vitest`.
- Arquivo `*.spec.ts(x)` ao lado do código.
- Funções puras e schemas: teste unitário. Componentes: Testing Library, consultando por papel e label como o usuário.
- Componente com rota: `createMemoryRouter`. Componente com GraphQL: `MockedProvider` de `@apollo/client/testing/react`.

## Idioma e texto

- Interface, mensagens e comentários em **pt-BR com acentuação correta**. Identificadores de código em inglês.
- Comentários explicam o **porquê**, não o quê.

## Rotas só de desenvolvimento

`/_dev/ui` (vitrine dos componentes de `ui/`) e `/_dev/screens` (telas com dados de exemplo do Figma) existem só em `import.meta.env.DEV` e ficam fora do build de produção. Servem para comparar com o Figma sem backend.

## Git

- O repositório é um só, na raiz `financy/`. **Nunca rode `git init` nesta pasta.**
- Commit só desta pasta: `git add frontend/`. Nunca `git add .` ou `git add -A` na raiz.
- `src/services/graphql/generated/` **é versionado** (o build não depende do backend no ar).
