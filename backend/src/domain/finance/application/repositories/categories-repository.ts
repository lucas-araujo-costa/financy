import type { Category } from '../../enterprise/entities/category'
import type {
  CategoryWithStats,
} from '../../enterprise/value-objects/category-with-stats'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  /** Compara pelo título normalizado: "Saúde" encontra "saude". */
  abstract findByTitle(userId: string, title: string): Promise<Category | null>
  abstract findWithStatsById(id: string): Promise<CategoryWithStats | null>
  /** Ordenadas pelo título normalizado. */
  abstract findManyWithStatsByUserId(
    userId: string,
  ): Promise<CategoryWithStats[]>

  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
}
