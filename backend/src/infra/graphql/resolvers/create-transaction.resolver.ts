import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeCreateTransactionUseCase,
} from '@/infra/factories/make-create-transaction-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { TransactionInput } from '@/infra/graphql/inputs/transaction-input'
import { TransactionType } from '@/infra/graphql/object-types/transaction-type'
import {
  TransactionPresenter,
} from '@/infra/graphql/presenters/transaction-presenter'

@Resolver()
export class CreateTransactionResolver {
  @Authorized()
  @Mutation(() => TransactionType)
  async createTransaction(
    @Arg('input', () => TransactionInput) input: TransactionInput,
    @CurrentUserId() userId: string,
  ): Promise<TransactionType> {
    const createTransaction = makeCreateTransactionUseCase()

    const result = await createTransaction.execute({ userId, ...input })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return TransactionPresenter.toGraphQL(result.value.transaction)
  }
}
