import type { UseCaseError } from '../use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Recurso não encontrado.')
    this.name = 'ResourceNotFoundError'
  }
}
