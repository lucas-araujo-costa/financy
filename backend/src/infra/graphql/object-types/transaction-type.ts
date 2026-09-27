import { DateResolver } from 'graphql-scalars'
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from 'type-graphql'

import type {
  TransactionType as DomainTransactionType,
} from '@/domain/finance/enterprise/types/transaction-type'

import { TransactionTypeEnum } from './transaction-type-enum'

/** O que a tabela de transações mostra da categoria (tag e ícone). */
@ObjectType('TransactionCategory')
export class TransactionCategoryType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string
}

@ObjectType('Transaction')
export class TransactionType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  description!: string

  @Field(() => Int, { description: 'Sempre positivo. O sinal vem de `type`.' })
  amountInCents!: number

  @Field(() => TransactionTypeEnum)
  type!: DomainTransactionType

  @Field(() => DateResolver, { description: 'Dia do calendário: YYYY-MM-DD.' })
  date!: Date

  @Field(() => TransactionCategoryType)
  category!: TransactionCategoryType

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
