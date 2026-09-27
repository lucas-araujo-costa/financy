# 0008. Mutations devolvem os mesmos read models das listagens

**Status:** aceita

## Contexto
Os tipos GraphQL mostram o que as telas precisam:
- **`Category`** traz `transactionsCount` e `totalInCents`;
- **`Transaction`** traz título, ícone e cor da categoria.

Se `createCategory` ou `editCategory` devolvessem só a entidade, os campos de estatística ficariam sem valor ou errados. Como o Apollo Client normaliza o cache por `__typename` + `id`, um valor errado sobrescreveria o correto da listagem.

## Decisão
- **Categoria:**
  - `createCategory` devolve um `CategoryWithStats` com estatísticas zeradas, porque uma categoria nova não tem transações;
  - `editCategory` relê as estatísticas com `findWithStatsById`.
- **Transação:** `createTransaction` e `editTransaction` devolvem um `TransactionWithCategory`, montado com a categoria que o use case já carregou para validar o dono. Não há query extra.
- **Categoria dentro da transação:** a transação aninha um tipo próprio, `TransactionCategory { id title icon color }`, sem estatísticas, para não misturar com `Category` no cache.

## Consequências
- O mesmo tipo GraphQL tem sempre os mesmos dados, venha de query ou de mutation.
- Editar uma categoria não atualiza sozinho as tags das transações no cache, porque `TransactionCategory` é outro tipo. Por isso o frontend refaz `GetTransactions` depois de editar uma categoria.
