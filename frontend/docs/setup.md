# Setup — Financy (frontend)

## Pré-requisitos

- **Node 24** (a versão está em `.nvmrc`). Com nvm: `nvm install && nvm use`.
- npm 11 (vem com o Node 24). O `.npmrc` usa `engine-strict=true` (outra versão do Node recusa a instalação) e `save-exact=true` (dependências com versão exata).
- **O backend rodando.** O frontend é um app separado e só conversa com a API GraphQL. Suba o backend antes (ver a documentação dele); por padrão ele fica em `http://localhost:3333/graphql` e aceita a origem `http://localhost:5173` (`CORS_ORIGIN`).

## Primeira vez

```bash
cd frontend
nvm use
npm install
cp .env.example .env
```

Preencha o `.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:3333/graphql
```

| Variável           | Obrigatória | O que é                                                                                                                                                   |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_BACKEND_URL` | sim         | URL completa do endpoint GraphQL do backend. Validada com Zod em `src/env.ts`: se faltar ou não for uma URL, o app falha ao iniciar com a mensagem do Zod |

## Rodando

```bash
npm run dev
```

Abra `http://localhost:5173`. Crie uma conta em "Criar conta" ou entre com o usuário demo que o seed do backend cria.

## Scripts

| Script                            | O que faz                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Servidor de desenvolvimento do Vite (`localhost:5173`)                                          |
| `npm run build`                   | Checagem de tipos (`tsc -b`) + build de produção em `dist/`                                     |
| `npm run preview`                 | Serve o build de produção localmente                                                            |
| `npm run codegen`                 | Gera `src/services/graphql/generated/` a partir do schema do backend (precisa do backend no ar) |
| `npm test`                        | Testes (Vitest, uma vez)                                                                        |
| `npm run test:watch`              | Testes em modo watch                                                                            |
| `npm run lint` / `lint:fix`       | ESLint                                                                                          |
| `npm run format` / `format:check` | Prettier (inclui a ordenação das classes do Tailwind)                                           |

## GraphQL Codegen

Os tipos das operações vêm do schema do backend, por introspecção de `VITE_BACKEND_URL` (config em `codegen.ts`). A pasta `generated/` é **versionada**, então `npm run build` e `npm test` funcionam sem o backend no ar.

Quando rodar:

- criou ou mudou um documento `graphql(...)` em `features/<f>/services/`;
- o backend mudou o contrato.

```bash
npm run codegen
npx tsc -b     # aponta o que quebrou com o contrato novo
```

## Vitrines de desenvolvimento

Com `npm run dev`, sem precisar do backend:

- `http://localhost:5173/_dev/ui`: todos os componentes de `components/ui` em todos os estados. `?open=select`, `?open=dialog` ou `?open=date` abrem o componente; `?screen=profile` mostra o card de perfil e o skeleton dele.
- `http://localhost:5173/_dev/screens?screen=dashboard|transactions|categories`: as telas com os dados de exemplo do Figma. `&loading=1` mostra os skeletons; `&open=transaction|category` abre os modais.

Essas rotas existem só em desenvolvimento e ficam fora do build de produção.

## Problemas comuns

| Sintoma                                                                    | Causa provável                                                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| "Não foi possível conectar ao servidor." (toast ao entrar ou tela de erro) | Backend fora do ar ou `VITE_BACKEND_URL` errada                                    |
| Erro de CORS no console                                                    | `CORS_ORIGIN` do backend diferente da origem do frontend (`http://localhost:5173`) |
| App não abre e o console mostra erro do Zod sobre `VITE_BACKEND_URL`       | `.env` ausente ou variável vazia                                                   |
| `npm run codegen` falha ao carregar o schema                               | Backend fora do ar                                                                 |
| `node: command not found` em shell de script                               | nvm não carregado: `. "$NVM_DIR/nvm.sh" && nvm use`                                |
| `npm install` recusa por versão do Node                                    | Use o Node 24 (`nvm use`)                                                          |
