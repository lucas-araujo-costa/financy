import type { UseCaseError } from '@/core/errors/use-case-error'

export class CategoryHasTransactionsError
  extends Error
  implements UseCaseError {
  constructor() {
    super(
      'Esta categoria tem transações. Mova ou exclua as transações antes de ' +
        'excluir a categoria.',
    )
    this.name = 'CategoryHasTransactionsError'
  }
}
