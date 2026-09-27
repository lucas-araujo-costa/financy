import { IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

import { TransactionsFilterInput } from './transactions-filter-input'

@ArgsType()
export class FetchTransactionsArgs {
  @Field(() => TransactionsFilterInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  filter?: TransactionsFilterInput | null

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page!: number

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  perPage!: number
}
