# 0002. Fastify + Apollo Server + TypeGraphQL (code-first)

**Status:** aceita

## Contexto
O desafio exige TypeScript e GraphQL, e pede CORS habilitado.

## Decisão
- **HTTP:** Fastify 5, com `@fastify/cors` (origem vinda de `CORS_ORIGIN`) e `@fastify/jwt` (tokens de 7 dias, `sub` = id do usuário).
- **Servidor GraphQL:** Apollo Server 5, ligado ao Fastify por `@as-integrations/fastify`. Em desenvolvimento ele também serve o Apollo Sandbox em `GET /graphql`.
- **Schema code-first** com TypeGraphQL 2:
  - classes com decorators viram o schema;
  - a validação dos inputs usa class-validator;
  - a autenticação usa `@Authorized()` + `authChecker`.
- **Tipos explícitos em todo decorator** (`@Field(() => String)`), porque o tsx, o tsup e o Vitest não emitem `emitDecoratorMetadata`.
- **Um resolver por use case.**

## Consequências
- O TypeGraphQL precisa do polyfill `reflect-metadata` importado antes de qualquer schema (ADR 0009).
- O schema nasce do código, e o frontend gera os tipos por introspecção. O contrato fica documentado em `docs/api-contract.md`.
- **Erros:** o `formatError` do Apollo não deixa vazar detalhes de erro inesperado.
- **Proteção contra CSRF:** fica ligada, que é o padrão do Apollo. Por isso os clientes precisam enviar `Content-Type: application/json`.
