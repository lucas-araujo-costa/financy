import { Field, Int, ObjectType } from 'type-graphql'

import { TransactionType } from './transaction-type'

@ObjectType('TransactionsPage')
export class TransactionsPageType {
  @Field(() => [TransactionType])
  items!: TransactionType[]

  @Field(() => Int, { description: 'Total de resultados com os filtros.' })
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}
