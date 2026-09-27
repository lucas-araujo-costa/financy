# Design tokens — Financy (frontend)

Tokens e medidas do layout do Figma ([Financy — Community](https://www.figma.com/community/file/1580994817007013257)). No código, os tokens estão em `@theme` em `src/styles/global.css`. **Use sempre as classes geradas por eles, nunca hex solto.** A paleta padrão do Tailwind está desligada (`--color-*: initial`).

## Cores

### Produto

| Token        | Hex       | Classe                             | Uso                                            |
| ------------ | --------- | ---------------------------------- | ---------------------------------------------- |
| `brand-dark` | `#124B2B` | `bg-brand-dark`                    | hover do botão primário                        |
| `brand-base` | `#1F6F43` | `bg-brand-base`, `text-brand-base` | botão primário, links, item ativo da nav, foco |

### Grayscale

| Token      | Hex       | Uso                                                 |
| ---------- | --------- | --------------------------------------------------- |
| `gray-800` | `#111827` | textos principais, valores                          |
| `gray-700` | `#374151` | labels, texto do botão outline                      |
| `gray-600` | `#4B5563` | textos secundários, nav inativa, datas              |
| `gray-500` | `#6B7280` | legendas em caixa alta, helper dos campos           |
| `gray-400` | `#9CA3AF` | placeholder, ícone de campo vazio                   |
| `gray-300` | `#D1D5DB` | borda de input e de botões, divisor, avatar         |
| `gray-200` | `#E5E7EB` | borda dos cards, hover de botões outline, tag cinza |
| `gray-100` | `#F8F9FA` | fundo das páginas                                   |

### Neutral e feedback

| Token     | Hex       | Uso                                                 |
| --------- | --------- | --------------------------------------------------- |
| `white`   | `#FFFFFF` | cards, inputs                                       |
| `black`   | `#000000` | overlay dos modais (`bg-black/20`)                  |
| `danger`  | `#EF4444` | erro de campo, ícone de excluir, botão `danger`     |
| `success` | `#19AD70` | check do item escolhido no Select, toast de sucesso |

### Cores de categoria

Cada cor tem `dark`, `base` e `light` (`bg-green-light`, `text-green-dark`, `text-green-base`…).

| Cor    | dark      | base      | light     |
| ------ | --------- | --------- | --------- |
| green  | `#15803D` | `#16A34A` | `#E0FAE9` |
| blue   | `#1D4ED8` | `#2563EB` | `#DBEAFE` |
| purple | `#7E22CE` | `#9333EA` | `#F3E8FF` |
| pink   | `#BE185D` | `#DB2777` | `#FCE7F3` |
| red    | `#B91C1C` | `#DC2626` | `#FEE2E2` |
| orange | `#C2410C` | `#EA580C` | `#FFEDD5` |
| yellow | `#A16207` | `#CA8A04` | `#F7F3CA` |

Uso:

- **Tag da categoria:** fundo `light` + texto `dark`.
- **Ícone da categoria** (quadrado de 40px, raio 8): fundo `light` + ícone `base`.
- **Swatch do color picker:** `base`.
- **Entrada / Saída:** ícone `green-base` / `red-base`, texto `green-dark` / `red-dark`.

O mapeamento chave → classes fica em `src/components/shared/category-style.ts`.

## Tipografia

Fonte **Inter** (Google Fonts, pesos 400, 500, 600 e 700), carregada no `index.html`.

| Uso                                                        | Tamanho / altura            | Peso                                   |
| ---------------------------------------------------------- | --------------------------- | -------------------------------------- |
| Título de página (Transações, Categorias)                  | 24 / 32                     | bold                                   |
| Valor dos cards de resumo e de estatística                 | 28 / 32                     | bold                                   |
| Título do card de login e cadastro                         | 20 / 28                     | bold                                   |
| Nome no perfil                                             | 20 / 28                     | semibold                               |
| Título de modal                                            | 16 / 24                     | semibold                               |
| Texto de campo, descrição da transação                     | 16 / 18–24                  | regular / medium                       |
| Label de campo, link, tag, botão sm, nav                   | 14 / 20                     | medium (nav: regular; ativo: semibold) |
| Valor na tabela e nas listas                               | 14 / 20                     | semibold                               |
| Legenda em caixa alta ("SALDO TOTAL", cabeçalho da tabela) | 12 / 16, `tracking-[0.6px]` | medium                                 |
| Helper e mensagem de erro de campo                         | 12 / 16                     | regular                                |

## Ícones

[Lucide](https://lucide.dev) (`lucide-react`). Tamanhos: 16px em campos, IconButton, botão sm e listas; 18px no botão md; 20px nos links (chevron, "+") e nos cards de resumo.

Os 16 ícones de categoria (ordem da grade 8×2): `briefcase-business`, `car-front`, `heart-pulse`, `piggy-bank`, `shopping-cart`, `ticket`, `tool-case`, `utensils`, `paw-print`, `house`, `gift`, `dumbbell`, `book-open`, `baggage-claim`, `mailbox`, `receipt-text`.

## Assets

| Arquivo                       | Origem no Figma             | Uso                                        |
| ----------------------------- | --------------------------- | ------------------------------------------ |
| `src/assets/logo.svg`         | vetor "Logo" (134×32)       | login e cadastro (134×32), header (100×24) |
| `src/assets/logo-icon.svg`    | vetor "Logo_Icon" (40×40)   | favicon (`public/favicon.svg`)             |
| `src/assets/currency-brl.svg` | prefixo "R$" do campo Valor | campo Valor do modal de transação          |

## Componentes (medidas do Style Guide)

| Componente            | Medidas                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input**             | altura 48, raio 8, borda `gray-300`, padding horizontal 14, ícone 16 com gap 12. Label 14 medium, 8px acima; helper 12, 8px abaixo. Estados: empty (ícone `gray-400`), active (label e ícone `brand-base`), filled (ícone `gray-800`), error (label e ícone `danger`), disabled (50%) |
| **Select**            | mesma caixa do Input com chevron; dropdown branco, raio 8, borda `gray-300`, sombra `0 4px 7.5px rgba(0,0,0,.1)`, 8px abaixo; item escolhido em medium com check `success`                                                                                                            |
| **Label Button**      | md: altura 48, padding 16, texto 16; sm: altura 36, padding 12, texto 14. Raio 8. Solid: `brand-base` → hover `brand-dark`. Outline: branco, borda `gray-300`, texto `gray-700` → hover `gray-200`. Disabled: 50%                                                                     |
| **Icon Button**       | 32×32, raio 8, borda `gray-300`, ícone 16. Outline (`gray-700`) e Danger (`danger`). Hover `gray-200`                                                                                                                                                                                 |
| **Link**              | 14 medium `brand-base`; hover com borda inferior `brand-base`                                                                                                                                                                                                                         |
| **Pagination Button** | 32×32, raio 8; ativo `brand-base` com texto branco                                                                                                                                                                                                                                    |
| **Tag**               | padding 12 × 4, raio total, texto 14 medium                                                                                                                                                                                                                                           |
| **Type**              | ícone 16 + texto 14 medium, gap 8 (Entrada verde, Saída vermelha)                                                                                                                                                                                                                     |
| **Card**              | branco, borda `gray-200`, raio 12                                                                                                                                                                                                                                                     |
| **Modal**             | overlay `black/20`; card de 448px, raio 12, padding 24, gap 24; título 16 semibold + subtítulo 14 `gray-600`; fechar com Icon Button                                                                                                                                                  |
| **Checkbox**          | 16×16, raio 4, borda `gray-300`                                                                                                                                                                                                                                                       |
| **Picker de ícone**   | grade 8×2 de botões de 42×42 com gap 8 (392px); borda `gray-300`, raio 8, glifo 20 `gray-500`; escolhido: borda `brand-base`, fundo `gray-100`, glifo `gray-800`                                                                                                                      |
| **Picker de cor**     | 7 botões com borda `gray-300`, raio 8, padding 4 e a cor `base` em 20px de altura; escolhido: borda `brand-base`, fundo `gray-100`                                                                                                                                                    |

## Telas

| Tela                      | Medidas principais                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header                    | 69px de altura: padding 16 em cima e embaixo + borda inferior `gray-200` de 1px, laterais 48; conteúdo até 1280px; nav centralizada, gap 20; avatar 36                                                                         |
| Miolo das páginas logadas | padding 48, conteúdo até 1280px, gap 32 entre blocos (24 no dashboard)                                                                                                                                                         |
| Login e cadastro          | logo a 48px do topo, card de 448px 32px abaixo, padding 32, gap 32                                                                                                                                                             |
| Dashboard                 | grade de 3 colunas; transações recentes ocupa 2; linhas de 80px                                                                                                                                                                |
| Transações                | filtros em 4 colunas; linhas da tabela de 72px; cabeçalho com padding 24 × 20                                                                                                                                                  |
| Categorias                | 3 cards de estatística (ícone de 24px numa área de 32, valor 28 bold, legenda em caixa alta), gap 24; grade de 4 colunas com gap 16; cards de 224px: padding 24, ícone 40, título + descrição de até 2 linhas, tag e "N itens" |
| Perfil                    | card de 448px centralizado; avatar 64                                                                                                                                                                                          |

## Movimento

O Figma não define animações. Tokens do projeto (`global.css`):

| Token           | Valor                           | Uso                                            |
| --------------- | ------------------------------- | ---------------------------------------------- |
| `duration-fast` | 150ms                           | hover, foco, borda, troca de ícone, saídas     |
| `duration-base` | 200ms                           | dialogs, dropdowns, toggles, mensagens de erro |
| `duration-slow` | 300ms                           | troca de página, entrada de conteúdo           |
| `ease-out`      | `cubic-bezier(0.16, 1, 0.3, 1)` | entradas                                       |
| `ease-in`       | `cubic-bezier(0.7, 0, 0.84, 0)` | saídas                                         |

A regra de uso é obrigatória e está no [`AGENTS.md`](../AGENTS.md#movimento-e-animações--regra-obrigatória).
