import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType('FinancialSummary')
export class FinancialSummaryType {
  @Field(() => Int, {
    description: 'Entradas menos saídas de todo o período. Pode ser negativo.',
  })
  balanceInCents!: number

  @Field(() => Int)
  monthIncomeInCents!: number

  @Field(() => Int)
  monthExpenseInCents!: number
}
