# 0009. Versões fixadas e ferramentas de build, lint e testes

**Status:** aceita

## Contexto
Em setembro de 2026, as versões `latest` de várias dependências quebravam a stack. Além disso, cada ferramenta precisa de um motivo técnico ou de requisito, e não entra só porque algum exemplo usa.

## Decisão
| Item | Versão/escolha | Motivo |
|---|---|---|
| Node | 24 (`.nvmrc`, `engine-strict`) | LTS. Tem `process.loadEnvFile()` e `--env-file` nativos |
| TypeScript | **6.0.3** | o 7.x (nativo) não expõe a API JS clássica, e o `typescript-eslint` aceita só `<6.1` |
| `graphql` | **16.x** | TypeGraphQL 2 e Apollo Server 5 pedem `^16` |
| TypeGraphQL | `2.0.0-rc.3` (tag `latest`) | versão compatível com `graphql` 16 e class-validator atual |
| `reflect-metadata` | 0.2 | o TypeGraphQL 2 chama `Reflect.getMetadata` em todo decorator, mesmo com o tipo explícito |
| Prisma | **7.10** | o `latest` do npm já é o 8.0-rc |
| Lint | `@rocketseat/eslint-config@3.0.12` + ESLint 9 | a versão estável (2.2.2) só roda com o ESLint 8, que está fora de suporte. A 3.x é flat config |
| Build | `tsup` | o `tsc` não reescreve o alias `@/` no JS gerado. O tsup usa o esbuild (o mesmo motor do tsx) e resolve alias e decorators. Não é mais mantido ativamente, o que foi aceito |
| Dev | `tsx watch --env-file=.env` | roda TS direto e resolve o alias |
| Testes | Vitest 5 + `@vitest/coverage-v8` + `@faker-js/faker` | o Vite 8 resolve os `paths` do tsconfig nativamente (`resolve.tsconfigPaths`), sem `vite-tsconfig-paths` |
| Env | Zod | falha na inicialização, dizendo qual variável falta |

- **Lint:** o `eslint.config.mjs` repete a regra de 80 colunas do preset, com um `ignorePattern` só para linhas `} from '...'`, porque um caminho de módulo não pode ser quebrado.

## Consequências
- **Não atualize** essas versões sem rever esta ADR. Ferramenta nova precisa de aprovação e de um motivo.
- O `@rocketseat/eslint-config` 3.x é beta e está parado. Se ele quebrar com uma versão futura do ESLint, reavalie o lint.
