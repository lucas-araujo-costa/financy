# Decisões de arquitetura (ADRs)

Cada ADR registra **uma** decisão: o contexto, o que foi decidido e as consequências. Uma decisão nova ganha o próximo número, e uma decisão substituída fica marcada como "Substituída por ADR N".

| # | Decisão | Status |
|---|---|---|
| [0001](0001-clean-architecture-ddd.md) | Clean Architecture + DDD com injeção manual por factories | Aceita |
| [0002](0002-fastify-apollo-typegraphql.md) | Fastify + Apollo Server + TypeGraphQL (code-first) | Aceita |
| [0003](0003-prisma-sqlite.md) | Prisma 7 + SQLite com o adapter `better-sqlite3` | Aceita |
| [0004](0004-dinheiro-em-centavos.md) | Dinheiro em centavos inteiros e tipo explícito | Aceita |
| [0005](0005-datas-do-calendario.md) | Data da transação como dia do calendário (`"YYYY-MM-DD"`) | Aceita |
| [0006](0006-titulo-e-busca-normalizados.md) | Título único e busca sem diferenciar maiúsculas e acentos | Aceita |
| [0007](0007-categoria-com-transacoes.md) | Categoria com transações não pode ser excluída | Aceita |
| [0008](0008-mutations-devolvem-read-models.md) | Mutations devolvem os mesmos read models das listagens | Aceita |
| [0009](0009-versoes-e-ferramentas.md) | Versões fixadas e ferramentas de build, lint e testes | Aceita |
