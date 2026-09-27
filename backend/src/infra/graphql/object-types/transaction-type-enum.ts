import { registerEnumType } from 'type-graphql'

import {
  TRANSACTION_TYPES,
  type TransactionType,
} from '@/domain/finance/enterprise/types/transaction-type'

/** Mesmo enum do domínio, exposto no schema como `TransactionType`. */
export const TransactionTypeEnum = Object.fromEntries(
  TRANSACTION_TYPES.map((type) => [type, type]),
) as { [Type in TransactionType]: Type }

registerEnumType(TransactionTypeEnum, {
  name: 'TransactionType',
  description: 'INCOME = Entrada (receita) · EXPENSE = Saída (despesa)',
})
