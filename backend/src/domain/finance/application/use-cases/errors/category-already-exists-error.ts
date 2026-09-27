import type { UseCaseError } from '@/core/errors/use-case-error'

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor(title: string) {
    super(`Você já tem uma categoria chamada "${title}".`)
    this.name = 'CategoryAlreadyExistsError'
  }
}
