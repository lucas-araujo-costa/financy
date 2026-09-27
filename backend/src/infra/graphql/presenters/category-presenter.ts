import type {
  CategoryWithStats,
} from '@/domain/finance/enterprise/value-objects/category-with-stats'
import type { CategoryType } from '@/infra/graphql/object-types/category-type'

export class CategoryPresenter {
  static toGraphQL(category: CategoryWithStats): CategoryType {
    return {
      id: category.categoryId.toString(),
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      transactionsCount: category.transactionsCount,
      totalInCents: category.totalInCents,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
