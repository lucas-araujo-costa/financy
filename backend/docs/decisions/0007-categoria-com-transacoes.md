# 0007. Categoria com transações não pode ser excluída

**Status:** aceita

## Contexto
Toda transação pertence a uma categoria. Ao excluir uma categoria usada, seria preciso apagar as transações dela (perdendo histórico) ou deixá-las sem categoria, o que o Figma não prevê.

## Decisão
- **Bloquear a exclusão:**
  - o `DeleteCategoryUseCase` conta as transações da categoria e devolve `CategoryHasTransactionsError` (`CONFLICT`) com uma mensagem clara;
  - no banco, a relação transação → categoria tem `onDelete: Restrict`, como segunda barreira.
- **Excluir o usuário** apaga as categorias e transações dele (`onDelete: Cascade`).

## Consequências
- Nenhum dado é perdido sem querer.
- Para excluir uma categoria, o usuário precisa antes mover ou excluir as transações dela. O frontend mostra a mensagem do erro.
