# CLAUDE.md: backend do Financy

@AGENTS.md

As regras do projeto estão no `AGENTS.md` (importado acima). Abaixo ficam só as instruções específicas para o Claude Code.

## Ambiente

- **Node vem do nvm.** Em shells não interativos o `node` pode não estar no PATH. Rode antes: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use` (o `.nvmrc` pede 24).
- O `.npmrc` tem `engine-strict=true` e `save-exact=true`: dependências entram com a versão exata.
- Para subir o servidor e testar, use `npm run dev` em background e aguarde com `curl --retry-connrefused`. Ao terminar, libere a porta 3333.

## Fluxo de trabalho

- Leia o arquivo antes de editar e siga o estilo do código ao redor.
- Ao terminar uma mudança, rode `npm run lint`, `npx tsc --noEmit`, `npm test` e `npm run test:e2e`, e informe o resultado real, inclusive falhas.
- Mudou o schema GraphQL? Atualize [`docs/api-contract.md`](docs/api-contract.md) e avise a pessoa: o frontend precisa rodar o `codegen` de novo.
- Decisão de arquitetura nova: registre uma ADR em [`docs/decisions/`](docs/decisions/).
- **Commit só quando pedirem**, e só de `backend/`. Nunca `git add -A` ou `git add .` na raiz do repositório.
- Dúvida entre duas soluções igualmente válidas, ou necessidade de dependência nova: pergunte antes.
