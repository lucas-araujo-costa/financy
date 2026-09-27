# CLAUDE.md — Financy (frontend)

**Leia [`AGENTS.md`](AGENTS.md) antes de qualquer coisa.** Ele tem a stack, as fronteiras entre pastas, o fluxo de dados e a regra obrigatória de movimento. Este arquivo só acrescenta o que é específico do Claude Code.

## Escopo

- Esta sessão edita **só `frontend/`**. O backend é outro app: consulte o contrato em [`docs/api-contract.md`](docs/api-contract.md) ou o schema por introspecção, nunca o código do backend como fonte.
- Mudança de contrato é decisão do backend. Se faltar campo, avise o usuário em vez de contornar.

## Ambiente

- O shell não interativo não tem `node` no PATH. Rode antes: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use`.
- Backend local em `http://localhost:3333/graphql` (ver [`docs/setup.md`](docs/setup.md)).

## Como trabalhar

1. Ferramenta nova só com aprovação explícita do usuário (lista do que já foi recusado em [`docs/decisions.md`](docs/decisions.md)).
2. Toda tela ou componente novo segue a seção **Movimento e animações** do `AGENTS.md`: nada de entrada, saída ou troca "seca", skeleton com o formato final, nada acima de 300ms.
3. Fidelidade ao Figma: tokens e medidas em [`docs/design-tokens.md`](docs/design-tokens.md). Não use hex solto.
4. Operação GraphQL nova: documento em `features/<f>/services/`, depois `npm run codegen`, depois o hook.
5. Ao terminar: `npm run format:check && npm run lint && npx tsc -b && npm test && npm run build`. Informe o resultado real, inclusive falhas.
6. Para conferir o visual sem backend, use `/_dev/ui` e `/_dev/screens` no `npm run dev`.

## Nunca

- `git init` nesta pasta, ou `git add .`/`git add -A` na raiz.
- React Router em "framework mode", ou qualquer framework por cima do Vite.
- Tipos de resposta da API escritos à mão.
- Dados de query copiados para `useState`.
