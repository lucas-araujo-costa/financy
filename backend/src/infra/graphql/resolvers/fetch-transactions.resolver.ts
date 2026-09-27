import { Args, Authorized, Query, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeFetchUserTransactionsUseCase,
} from '@/infra/factories/make-fetch-user-transactions-use-case'
import { graphQLError } from '@/infra/graphql/errors/to-graphql-error'
import {
  FetchTransactionsArgs,
} from '@/infra/graphql/inputs/fetch-transactions-args'
import {
  TransactionsPageType,
} from '@/infra/graphql/object-types/transactions-page-type'
import {
  TransactionPresenter,
} from '@/infra/graphql/presenters/transaction-presenter'

@Resolver()
export class FetchTransactionsResolver {
  @Authorized()
  @Query(() => TransactionsPageType, {
    description: 'Transações do usuário, da mais recente para a mais antiga.',
  })
  async transactions(
    @Args(() => FetchTransactionsArgs)
    { filter, page, perPage }: FetchTransactionsArgs,
    @CurrentUserId() userId: string,
  ): Promise<TransactionsPageType> {
    const month = filter?.month ?? undefined
    const year = filter?.year ?? undefined

    if ((month === undefined) !== (year === undefined)) {
      throw graphQLError('Informe o mês e o ano juntos.', 'BAD_USER_INPUT')
    }

    const fetchUserTransactions = makeFetchUserTransactionsUseCase()

    const result = await fetchUserTransactions.execute({
      userId,
      filters: {
        search: filter?.search ?? undefined,
        type: filter?.type ?? undefined,
        categoryId: filter?.categoryId ?? undefined,
        period: month && year
          ? { month, year }
          : undefined,
      },
      page,
      perPage,
    })

    return {
      items: result.value.transactions.map(TransactionPresenter.toGraphQL),
      total: result.value.total,
      page,
      perPage,
    }
  }
}
