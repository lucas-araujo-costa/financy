import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  type CategoryProps,
} from '@/domain/finance/enterprise/entities/category'
import {
  CATEGORY_COLORS,
} from '@/domain/finance/enterprise/types/category-color'
import { CATEGORY_ICONS } from '@/domain/finance/enterprise/types/category-icon'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  return Category.create(
    {
      userId: new UniqueEntityID(),
      // O sufixo evita títulos repetidos para o mesmo usuário.
      title: `${faker.commerce.department()} ${faker.string.alphanumeric(6)}`,
      description: faker.lorem.sentence(),
      icon: faker.helpers.arrayElement(CATEGORY_ICONS),
      color: faker.helpers.arrayElement(CATEGORY_COLORS),
      ...override,
    },
    id,
  )
}
