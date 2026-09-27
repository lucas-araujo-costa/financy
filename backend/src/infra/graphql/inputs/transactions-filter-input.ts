import { IsInt, IsOptional, Max, MaxLength, Min } from 'class-validator'
import { Field, ID, InputType, Int } from 'type-graphql'

import type {
  TransactionType,
} from '@/domain/finance/enterprise/types/transaction-type'
import {
  TransactionTypeEnum,
} from '@/infra/graphql/object-types/transaction-type-enum'

@InputType('TransactionsFilter')
export class TransactionsFilterInput {
  @Field(() => String, {
    nullable: true,
    description: 'Trecho da descrição. Ignora maiúsculas e acentos.',
  })
  @IsOptional()
  @MaxLength(100)
  search?: string | null

  @Field(() => TransactionTypeEnum, { nullable: true })
  type?: TransactionType | null

  @Field(() => ID, { nullable: true })
  categoryId?: string | null

  @Field(() => Int, { nullable: true, description: '1 a 12. Exige `year`.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number | null

  @Field(() => Int, { nullable: true, description: 'Exige `month`.' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(9999)
  year?: number | null
}
