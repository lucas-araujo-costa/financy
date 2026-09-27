import type { UseCaseError } from '@/core/errors/use-case-error'

// Mesma mensagem para e-mail inexistente e senha errada, para não revelar
// quais e-mails têm conta.
export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('E-mail ou senha inválidos.')
    this.name = 'WrongCredentialsError'
  }
}
