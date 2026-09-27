import {
  EditCategoryUseCase,
} from '@/domain/finance/application/use-cases/edit-category'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'

export function makeEditCategoryUseCase() {
  return new EditCategoryUseCase(new PrismaCategoriesRepository(prisma))
}
