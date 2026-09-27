import type {
  TransactionWithCategory,
} from '@/domain/finance/enterprise/value-objects/transaction-with-category'
import type {
  TransactionType,
} from '@/infra/graphql/object-types/transaction-type'

export class TransactionPresenter {
  static toGraphQL(transaction: TransactionWithCategory): TransactionType {
    return {
      id: transaction.transactionId.toString(),
      description: transaction.description,
      amountInCents: transaction.amountInCents,
      type: transaction.type,
      date: transaction.date,
      category: {
        id: transaction.category.id.toString(),
        title: transaction.category.title,
        icon: transaction.category.icon,
        color: transaction.category.color,
      },
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }
}
