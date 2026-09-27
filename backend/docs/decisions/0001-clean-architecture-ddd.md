# 0001. Clean Architecture + DDD com injeção manual por factories

**Status:** aceita

## Contexto
A API tem regras que precisam valer sempre: cada usuário só mexe nos próprios dados, títulos são únicos, categorias com transações não podem ser apagadas. Essas regras precisam ser testáveis sem banco nem HTTP, e o GraphQL e o Prisma são detalhes que podem mudar.

## Decisão
- **Três camadas:** `core/` (peças genéricas), `domain/` (entidades, read models, use cases e contratos) e `infra/` (Fastify, Apollo, TypeGraphQL, Prisma, bcrypt, JWT).
- **Direção das dependências:** o domínio não importa nada da infra. Ele declara contratos como classes abstratas (`CategoriesRepository`, `HashGenerator`, `Encrypter`), e a infra os implementa.
- **Dois contextos:** `identity` (conta) e `finance` (categorias, transações, resumo).
- **Use cases** devolvem `Either<Erro, Sucesso>` em vez de lançar exceção.
- **Injeção de dependência manual:** uma factory por use case (`make-*-use-case.ts`), sem container.
- **Fica de fora** o que o Financy não usa: `AggregateRoot`, eventos de domínio e `WatchedList`.

## Consequências
- Os use cases são testados com repositórios em memória, em milissegundos.
- O resolver só traduz a requisição: valida a entrada, chama a factory, executa o use case, trata o `Either` e passa pelo presenter.
- Há mais arquivos por operação (use case, factory, resolver, presenter), e a checklist em `AGENTS.md` guia esse fluxo.
- Os repositórios em memória precisam imitar o Prisma (ordenação, normalização, agregações), senão os testes deixam de representar o banco real.
