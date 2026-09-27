import { Args, Authorized, Query, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeGetFinancialSummaryUseCase,
} from '@/infra/factories/make-get-financial-summary-use-case'
import {
  FinancialSummaryArgs,
} from '@/infra/graphql/inputs/financial-summary-args'
import {
  FinancialSummaryType,
} from '@/infra/graphql/object-types/financial-summary-type'
import {
  FinancialSummaryPresenter,
} from '@/infra/graphql/presenters/financial-summary-presenter'

@Resolver()
export class FinancialSummaryResolver {
  @Authorized()
  @Query(() => FinancialSummaryType, {
    description: 'Saldo de todo o período e entradas/saídas do mês pedido.',
  })
  async financialSummary(
    @Args(() => FinancialSummaryArgs) { month, year }: FinancialSummaryArgs,
    @CurrentUserId() userId: string,
  ): Promise<FinancialSummaryType> {
    const getFinancialSummary = makeGetFinancialSummaryUseCase()

    const result = await getFinancialSummary.execute({ userId, month, year })

    return FinancialSummaryPresenter.toGraphQL(result.value.summary)
  }
}
