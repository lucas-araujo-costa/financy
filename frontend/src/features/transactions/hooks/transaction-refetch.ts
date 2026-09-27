// Uma transação muda a lista, o resumo e a contagem/total das categorias (architecture.md › Cache)
export const transactionRefetch = {
  refetchQueries: ['GetTransactions', 'GetFinancialSummary', 'GetCategories'],
  awaitRefetchQueries: true,
}
