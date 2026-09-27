import { buildSchema } from 'type-graphql'

import { authChecker } from '@/infra/auth/auth-checker'

import { AuthenticateResolver } from './resolvers/authenticate.resolver'
import { CreateCategoryResolver } from './resolvers/create-category.resolver'
import {
  CreateTransactionResolver,
} from './resolvers/create-transaction.resolver'
import { DeleteCategoryResolver } from './resolvers/delete-category.resolver'
import {
  DeleteTransactionResolver,
} from './resolvers/delete-transaction.resolver'
import { EditCategoryResolver } from './resolvers/edit-category.resolver'
import { EditProfileResolver } from './resolvers/edit-profile.resolver'
import { EditTransactionResolver } from './resolvers/edit-transaction.resolver'
import { FetchCategoriesResolver } from './resolvers/fetch-categories.resolver'
import {
  FetchTransactionsResolver,
} from './resolvers/fetch-transactions.resolver'
import {
  FinancialSummaryResolver,
} from './resolvers/financial-summary.resolver'
import { MeResolver } from './resolvers/me.resolver'
import { RegisterResolver } from './resolvers/register.resolver'

export function buildGraphQLSchema() {
  return buildSchema({
    resolvers: [
      RegisterResolver,
      AuthenticateResolver,
      MeResolver,
      EditProfileResolver,
      FetchCategoriesResolver,
      CreateCategoryResolver,
      EditCategoryResolver,
      DeleteCategoryResolver,
      FetchTransactionsResolver,
      CreateTransactionResolver,
      EditTransactionResolver,
      DeleteTransactionResolver,
      FinancialSummaryResolver,
    ],
    authChecker,
    // Roda o class-validator nos inputs e args. Erro vira BAD_USER_INPUT.
    validate: true,
  })
}
