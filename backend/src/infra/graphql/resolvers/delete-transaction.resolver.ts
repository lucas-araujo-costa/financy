import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeDeleteTransactionUseCase,
} from '@/infra/factories/make-delete-transaction-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'

@Resolver()
export class DeleteTransactionResolver {
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => ID) transactionId: string,
    @CurrentUserId() userId: string,
  ): Promise<boolean> {
    const deleteTransaction = makeDeleteTransactionUseCase()

    const result = await deleteTransaction.execute({ userId, transactionId })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return true
  }
}
