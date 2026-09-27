import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql'

import { CurrentUserId } from '@/infra/auth/current-user-id'
import {
  makeEditTransactionUseCase,
} from '@/infra/factories/make-edit-transaction-use-case'
import { toGraphQLError } from '@/infra/graphql/errors/to-graphql-error'
import { TransactionInput } from '@/infra/graphql/inputs/transaction-input'
import { TransactionType } from '@/infra/graphql/object-types/transaction-type'
import {
  TransactionPresenter,
} from '@/infra/graphql/presenters/transaction-presenter'

@Resolver()
export class EditTransactionResolver {
  @Authorized()
  @Mutation(() => TransactionType)
  async editTransaction(
    @Arg('id', () => ID) transactionId: string,
    @Arg('input', () => TransactionInput) input: TransactionInput,
    @CurrentUserId() userId: string,
  ): Promise<TransactionType> {
    const editTransaction = makeEditTransactionUseCase()

    const result = await editTransaction.execute({
      userId,
      transactionId,
      ...input,
    })

    if (result.isLeft()) {
      throw toGraphQLError(result.value)
    }

    return TransactionPresenter.toGraphQL(result.value.transaction)
  }
}
