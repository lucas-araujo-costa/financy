import type { TransactionType } from '@/components/shared/transaction-type-badge'

/*
 * Props de exibição (não são tipos de resposta da API). Os nomes seguem o
 * contrato (docs/api-contract.md) e o read model do backend, então o tipo gerado pelo
 * codegen para a query `GetTransactions` encaixa aqui sem conversão.
 */
export interface TransactionListItem {
  id: string
  description: string
  amountInCents: number
  type: TransactionType
  /** Dia do calendário: "YYYY-MM-DD" */
  date: string
  category: {
    id: string
    title: string
    icon: string
    color: string
  }
}

export interface CategoryOption {
  id: string
  title: string
}
