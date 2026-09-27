import {
  CreateCategoryUseCase,
} from '@/domain/finance/application/use-cases/create-category'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'

export function makeCreateCategoryUseCase() {
  return new CreateCategoryUseCase(new PrismaCategoriesRepository(prisma))
}
