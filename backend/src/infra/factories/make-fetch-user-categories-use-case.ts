import {
  FetchUserCategoriesUseCase,
} from '@/domain/finance/application/use-cases/fetch-user-categories'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'

export function makeFetchUserCategoriesUseCase() {
  return new FetchUserCategoriesUseCase(new PrismaCategoriesRepository(prisma))
}
