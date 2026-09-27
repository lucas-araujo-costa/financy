import { z } from 'zod'

import { toCalendarDate } from '@/lib/format'

export const transactionFormSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().trim().min(1, 'Informe a descrição'),
  date: z.date({ error: 'Selecione a data' }),
  amountInCents: z
    .number({ error: 'Informe o valor' })
    .int()
    .positive('Informe um valor maior que zero'),
  categoryId: z.string({ error: 'Selecione a categoria' }).min(1, {
    error: 'Selecione a categoria',
  }),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

/** Valores do formulário → `TransactionInput` do contrato (data "YYYY-MM-DD") */
export function toTransactionInput(values: TransactionFormValues) {
  return {
    description: values.description,
    amountInCents: values.amountInCents,
    type: values.type,
    date: toCalendarDate(values.date),
    categoryId: values.categoryId,
  }
}
