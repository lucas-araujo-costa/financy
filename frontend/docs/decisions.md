# Decisões — Financy (frontend)

Registro curto das decisões de arquitetura e ferramentas, com o motivo. Cada uma diz o que foi escolhido, por quê e o que ficou de fora. Os requisitos obrigatórios do desafio são: TypeScript, React, **Vite sem framework**, **GraphQL** e seguir o layout do Figma o mais fielmente possível.

## ADR-01 · Apollo Client + GraphQL Codegen

- **Decisão:** Apollo Client 4 como cliente GraphQL e cache do estado do servidor; GraphQL Codegen (client preset) gerando os tipos das operações a partir do schema do backend.
- **Por quê:** GraphQL é obrigatório. O cache normalizado do Apollo separa o estado do servidor do estado de UI, e `refetchQueries` por nome resolve o impacto de uma mutation em outras telas. O codegen elimina tipo de resposta escrito à mão: se o contrato muda, o `tsc` aponta.
- **Detalhes:** a saída do codegen (`src/services/graphql/generated/`) é versionada, para o build não depender do backend no ar. `rxjs` entrou por ser dependência obrigatória (peer) do Apollo 4.
- **Fora:** TanStack Query (seria uma segunda camada de cache sem ganho aqui).

## ADR-02 · Organização por features

- **Decisão:** `features/<f>/{pages,components,hooks,services,schemas}` + `index.ts` público; `components/ui` (design system sem domínio) e `components/shared` (peças de domínio usadas por várias features).
- **Por quê:** o que é de uma tela fica perto dela, e a fronteira entre features é explícita (só pelo `index.ts`).
- **Consequência:** os mapas de ícone e cor de categoria ficam em `components/shared/category-style.ts`, e não dentro de `features/categories`, porque dashboard, transações e categorias usam.

## ADR-03 · React Router 7 em modo biblioteca

- **Decisão:** `createBrowserRouter` + `RouterProvider`, versão 7.x fixada.
- **Por quê:** o desafio exige "Vite sem framework"; o "framework mode" do React Router seria um framework. A versão 8 já existia, mas a 7 foi a escolhida no planejamento e atende tudo (inclusive `viewTransition`).

## ADR-04 · Tailwind v4 + shadcn/ui configurado à mão

- **Decisão:** Tailwind v4 com os tokens do Figma em `@theme` e a paleta padrão desligada (`--color-*: initial`). Componentes do shadcn (Radix) adicionados com `components.json` escrito à mão (estilo `new-york`, `cssVariables: false`) e depois reestilizados.
- **Por quê:** o `shadcn init` com preset traz `@fontsource-variable/inter`, o pacote `shadcn` como dependência de runtime e fontes que não queremos. A fonte Inter vem do Google Fonts, como o Style Guide indica, por um `<link>` no `index.html`.
- **`cn`:** o shadcn 4 instala o pacote `cn` (do próprio shadcn), que substitui `clsx` + `tailwind-merge`. Ele é reexportado por `src/lib/utils.ts`.
- **Fora:** `date-fns` (o `shadcn add calendar` instala, mas o componente não importa; o `react-day-picker` já traz o que precisa); fontsource; `clsx`/`tailwind-merge`.

## ADR-05 · Datas e moeda com `Intl`

- **Decisão:** `Intl.NumberFormat` e `Intl.DateTimeFormat` (pt-BR) em `lib/format.ts`. O calendário é o do shadcn (`react-day-picker`) com o locale pt-BR dele.
- **Por quê:** nativo, sem dependência.
- **Datas de transação:** o contrato usa o escalar `Date` (`YYYY-MM-DD`), um dia do calendário. A formatação é sempre em UTC (`new Date("2025-11-30")` é meia-noite UTC), para o dia não "voltar" no fuso de Brasília. O calendário trabalha com `Date` local e converte com `toCalendarDate`/`fromCalendarDate`.

## ADR-06 · Movimento sem biblioteca de animação

- **Decisão:** transições do Tailwind, `tw-animate-css` com o `data-state` do Radix, View Transitions API pelo React Router e as animações do sonner. Tokens de duração e easing em `global.css`.
- **Por quê:** o Figma não define animações, e o projeto exige que nada mude de forma "seca". Tudo isso já vem com a stack. Uma biblioteca (ex.: Motion) só entra com aprovação, se aparecer algo que CSS e View Transitions não resolvem.
- **Detalhe técnico:** no Tailwind v4, `duration-*` não lê do `@theme`; por isso `duration-fast/base/slow` são `@utility` em `global.css`, que também definem `--tw-duration` para o `tw-animate-css`.
- A regra completa está no [`AGENTS.md`](../AGENTS.md#movimento-e-animações--regra-obrigatória).

## ADR-07 · Lint: `@rocketseat/eslint-config` 3.x + `eslint-config-prettier`

- **Decisão:** ESLint 9 (flat config) com `@rocketseat/eslint-config@3.0.12` e `eslint-config-prettier`; Prettier separado, com `prettier-plugin-tailwindcss`.
- **Por quê:** a versão estável 2.x exige ESLint 8 (fora de suporte) e não reconhece TypeScript 6. A 3.x ainda é beta, mas é a que funciona com ESLint 9. Ela não integra o Prettier e algumas regras de estilo brigam com ele (ex.: ternário sempre multilinha); o `eslint-config-prettier` desliga essas regras.

## ADR-08 · TypeScript 6

- **Decisão:** TypeScript 6.0.x, fixado.
- **Por quê:** o TypeScript 7 (nativo) não tem a API JavaScript que o `typescript-eslint` usa, e o `typescript-eslint` aceita até `<6.1`.

## ADR-09 · Filtros e paginação na URL

- **Decisão:** `?search=&type=&categoryId=&period=YYYY-MM&page=N`, lidos e escritos por `useTransactionFilters`, validados com Zod (`.catch` para valor inválido).
- **Por quê:** o link pode ser compartilhado, o botão voltar funciona e o F5 não perde o filtro. Mudar filtro volta para a página 1. A busca espera 300ms sem digitação antes de ir para a URL.
- **Período:** sem `period` vale o mês atual (o Figma mostra um mês selecionado). As opções são os últimos 12 meses e "Todo o período" (`period=all`).

## ADR-10 · Token e "Lembrar-me"

- **Decisão:** "Lembrar-me" marcado guarda o token no `localStorage`; desmarcado, no `sessionStorage`. O cadastro, que não tem a opção, usa `sessionStorage`.
- **Por quê:** é o comportamento que o usuário espera da caixa "Lembrar-me" do Figma.

## ADR-11 · `UNAUTHENTICATED` global, menos no login

- **Decisão:** qualquer `UNAUTHENTICATED` em operação privada limpa o token e o cache e volta para `/`. `Authenticate` e `Register` ficam fora.
- **Por quê:** o backend devolve `UNAUTHENTICATED` também para senha errada. No login isso é erro do formulário ("E-mail ou senha incorretos."), não sessão expirada.

## ADR-12 · Excluir categoria com transações

- **Decisão:** a interface avisa e desabilita o "Excluir" quando a categoria tem transações; o backend também recusa com `CONFLICT`.
- **Por quê:** o backend bloqueia a exclusão (em vez de apagar as transações junto). Avisar antes evita um erro depois do clique.

## ADR-13 · O que o Figma não mostra (decisões de interface)

- **Confirmação de exclusão:** dialog no mesmo estilo dos modais, com "Cancelar" e "Excluir". O "Excluir" usa a variante `danger` do `Button`, que não está no Style Guide.
- **Modais de edição:** reaproveitam os de criação, com título "Editar …" e campos preenchidos.
- **Posição dos toasts:** canto inferior direito. No superior direito o toast cobria o avatar "Meu perfil" durante os ~4s em que fica na tela (achado nos testes com Playwright); logo abaixo do header cobriria "Nova transação"/"Nova categoria", e no centro do topo, a navegação.
- **"Recuperar senha":** fora dos requisitos. O link aparece como no Figma e mostra um toast "em breve".
- **Estados vazio, de erro e de carregamento:** não estão no Figma. Seguem o estilo dos cards; o carregamento é sempre skeleton no formato final.
- **Telas de Cadastro e Categorias e o modal "Nova categoria":** foram feitos antes de haver referência do Figma (o limite do plano gratuito bloqueou a inspeção) e depois conferidos com prints oficiais dessas telas, comparando pixel a pixel na mesma escala. Os textos batiam; o espaçamento da grade de categorias, a altura dos cards, o tamanho dos ícones de estatística, a grade de ícones do modal, a posição do "Opcional" e a cor do ícone selecionado foram corrigidos.

## ADR-14 · Desvios conscientes do Figma

- **Borda do input no foco e no erro:** no Figma só o label e o ícone mudam de cor. Aqui a borda também muda (brand no foco, danger no erro), para o foco ficar visível e seguir a regra de movimento (borda transiciona).
- **Item do Select com foco:** ganha fundo cinza claro, para a navegação por teclado ficar visível. O Figma só mostra o check no item escolhido.
- **Foco ao abrir um dialog:** vai para o primeiro campo, não para o botão de fechar.
- **Coluna da tag nas transações recentes:** cresce além dos 160px do Figma quando o nome da categoria é longo, em vez de cortar o texto.

## ADR-15 · Vitrines só de desenvolvimento

- **Decisão:** `/_dev/ui` e `/_dev/screens`, carregadas com `lazy` só quando `import.meta.env.DEV`.
- **Por quê:** comparar componentes e telas com o Figma sem precisar do backend. Não entram no build de produção.
