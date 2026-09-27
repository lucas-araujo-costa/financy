import { GraphQLError } from 'graphql'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import {
  ResourceNotFoundError,
} from '@/core/errors/errors/resource-not-found-error'
import type { UseCaseError } from '@/core/errors/use-case-error'
import {
  CategoryAlreadyExistsError,
} from '@/domain/finance/application/use-cases/errors/category-already-exists-error'
import {
  CategoryHasTransactionsError,
} from '@/domain/finance/application/use-cases/errors/category-has-transactions-error'
import {
  InvalidTransactionAmountError,
} from '@/domain/finance/application/use-cases/errors/invalid-transaction-amount-error'
import {
  UserAlreadyExistsError,
} from '@/domain/identity/application/use-cases/errors/user-already-exists-error'
import {
  WrongCredentialsError,
} from '@/domain/identity/application/use-cases/errors/wrong-credentials-error'

export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BAD_USER_INPUT'

// Mesmo mapa da seção "Erros" de docs/api-contract.md.
const errorCodes: [new (...args: never[]) => UseCaseError, ErrorCode][] = [
  [WrongCredentialsError, 'UNAUTHENTICATED'],
  [NotAllowedError, 'FORBIDDEN'],
  [ResourceNotFoundError, 'NOT_FOUND'],
  [UserAlreadyExistsError, 'CONFLICT'],
  [CategoryAlreadyExistsError, 'CONFLICT'],
  [CategoryHasTransactionsError, 'CONFLICT'],
  [InvalidTransactionAmountError, 'BAD_USER_INPUT'],
]

export function graphQLError(message: string, code: ErrorCode) {
  return new GraphQLError(message, { extensions: { code } })
}

/** Converte o Left de um use case em erro GraphQL com `extensions.code`. */
export function toGraphQLError(error: UseCaseError) {
  const [, code] =
    errorCodes.find(([ErrorClass]) => error instanceof ErrorClass) ?? []

  if (!code) {
    // Erro de domínio sem código mapeado é bug: vira erro interno.
    return new Error(error.message)
  }

  return graphQLError(error.message, code)
}
