import type { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidTransactionAmountError
  extends Error
  implements UseCaseError {
  constructor() {
    super('O valor deve ser maior que zero, em centavos inteiros.')
    this.name = 'InvalidTransactionAmountError'
  }
}
