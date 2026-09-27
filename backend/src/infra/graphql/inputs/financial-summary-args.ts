import { IsInt, Max, Min } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export class FinancialSummaryArgs {
  @Field(() => Int, { description: '1 a 12.' })
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number

  @Field(() => Int)
  @IsInt()
  @Min(1900)
  @Max(9999)
  year!: number
}
