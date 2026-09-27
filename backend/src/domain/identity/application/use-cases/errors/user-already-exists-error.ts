import type { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Já existe uma conta com este e-mail.')
    this.name = 'UserAlreadyExistsError'
  }
}
