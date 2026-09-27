import { IsInt, IsPositive, Matches, MaxLength } from 'class-validator'
import { DateResolver } from 'graphql-scalars'
import { Field, ID, InputType, Int } from 'type-graphql'

import type {
  TransactionType,
} from '@/domain/finance/enterprise/types/transaction-type'
import {
  TransactionTypeEnum,
} from '@/infra/graphql/object-types/transaction-type-enum'

@InputType()
export class TransactionInput {
  @Field(() => String)
  @Matches(/\S/, { message: 'Informe a descrição.' })
  @MaxLength(100)
  description!: string

  @Field(() => Int, { description: 'Em centavos: R$ 89,50 = 8950.' })
  @IsInt()
  @IsPositive({ message: 'O valor deve ser maior que zero.' })
  amountInCents!: number

  @Field(() => TransactionTypeEnum)
  type!: TransactionType

  @Field(() => DateResolver, { description: 'Dia do calendário: YYYY-MM-DD.' })
  date!: Date

  @Field(() => ID)
  categoryId!: string
}
