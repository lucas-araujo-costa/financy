/*
 * Props de exibição (não são tipos de resposta da API). Os nomes seguem o
 * contrato (docs/api-contract.md: categories traz transactionsCount e totalInCents), então o
 * tipo gerado pelo codegen para `GetCategories` encaixa aqui.
 */
export interface CategoryListItem {
  id: string
  title: string
  description?: string | null
  icon: string
  color: string
  transactionsCount: number
  totalInCents: number
}
