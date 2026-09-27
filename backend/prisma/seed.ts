import 'reflect-metadata'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/finance/enterprise/entities/category'
import { Transaction } from '@/domain/finance/enterprise/entities/transaction'
import type {
  CategoryColor,
} from '@/domain/finance/enterprise/types/category-color'
import type {
  CategoryIcon,
} from '@/domain/finance/enterprise/types/category-icon'
import type {
  TransactionType,
} from '@/domain/finance/enterprise/types/transaction-type'
import { User } from '@/domain/identity/enterprise/entities/user'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { prisma } from '@/infra/database/prisma/client'
import {
  PrismaCategoriesRepository,
} from '@/infra/database/prisma/repositories/prisma-categories-repository'
import {
  PrismaTransactionsRepository,
} from '@/infra/database/prisma/repositories/prisma-transactions-repository'
import {
  PrismaUsersRepository,
} from '@/infra/database/prisma/repositories/prisma-users-repository'

// Usuário e dados das telas do Figma.
const DEMO_USER = {
  name: 'Conta teste',
  email: 'conta@teste.com',
  password: '12345678',
}

// Cores conferidas nas tags das telas Dashboard e Transações do Figma. A de
// Saúde não aparece em nenhuma tela (a categoria não tem transações), então é
// uma escolha nossa.
const CATEGORIES: {
  title: string
  description: string
  icon: CategoryIcon
  color: CategoryColor
}[] = [
  {
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: 'utensils',
    color: 'blue',
  },
  {
    title: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: 'car-front',
    color: 'purple',
  },
  {
    title: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: 'tool-case',
    color: 'yellow',
  },
  {
    title: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: 'ticket',
    color: 'pink',
  },
  {
    title: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: 'piggy-bank',
    color: 'green',
  },
  {
    title: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: 'shopping-cart',
    color: 'orange',
  },
  {
    title: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: 'briefcase-business',
    color: 'green',
  },
  {
    title: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: 'heart-pulse',
    color: 'red',
  },
]

// No Figma, dezembro/2025 é o "mês atual" do dashboard. Os dias são mantidos e
// os meses são deslocados para o mês corrente (0) e o anterior (1), para o
// dashboard não abrir zerado.
const TRANSACTIONS: {
  description: string
  category: string
  type: TransactionType
  amountInCents: number
  monthsAgo: number
  day: number
}[] = [
  {
    description: 'Pagamento de Salário',
    category: 'Salário',
    type: 'INCOME',
    amountInCents: 425_000,
    monthsAgo: 0,
    day: 1,
  },
  {
    description: 'Cinema',
    category: 'Entretenimento',
    type: 'EXPENSE',
    amountInCents: 8_800,
    monthsAgo: 0,
    day: 18,
  },
  {
    description: 'Jantar no Restaurante',
    category: 'Alimentação',
    type: 'EXPENSE',
    amountInCents: 8_950,
    monthsAgo: 1,
    day: 30,
  },
  {
    description: 'Posto de Gasolina',
    category: 'Transporte',
    type: 'EXPENSE',
    amountInCents: 10_000,
    monthsAgo: 1,
    day: 29,
  },
  {
    description: 'Compras no Mercado',
    category: 'Mercado',
    type: 'EXPENSE',
    amountInCents: 15_680,
    monthsAgo: 1,
    day: 28,
  },
  {
    description: 'Retorno de Investimento',
    category: 'Investimento',
    type: 'INCOME',
    amountInCents: 34_025,
    monthsAgo: 1,
    day: 26,
  },
  {
    description: 'Aluguel',
    category: 'Utilidades',
    type: 'EXPENSE',
    amountInCents: 170_000,
    monthsAgo: 1,
    day: 26,
  },
  {
    description: 'Freelance',
    category: 'Salário',
    type: 'INCOME',
    amountInCents: 250_000,
    monthsAgo: 1,
    day: 24,
  },
  {
    description: 'Compras Jantar',
    category: 'Mercado',
    type: 'EXPENSE',
    amountInCents: 15_000,
    monthsAgo: 1,
    day: 22,
  },
]

/**
 * Meia-noite UTC do dia `day`, `monthsAgo` meses atrás. O dia é limitado ao
 * tamanho do mês e, no mês atual, a hoje (nenhuma transação no futuro).
 */
function calendarDay(monthsAgo: number, day: number) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() - monthsAgo
  const lastDay =
    monthsAgo === 0
      ? now.getUTCDate()
      : new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return new Date(Date.UTC(year, month, Math.min(day, lastDay)))
}

async function seed() {
  const usersRepository = new PrismaUsersRepository(prisma)
  const categoriesRepository = new PrismaCategoriesRepository(prisma)
  const transactionsRepository = new PrismaTransactionsRepository(prisma)

  // Idempotente: apagar o usuário apaga as categorias e transações (Cascade).
  await prisma.user.deleteMany({ where: { email: DEMO_USER.email } })

  const user = User.create({
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    passwordHash: await new BcryptHasher().hash(DEMO_USER.password),
  })
  await usersRepository.create(user)

  const categoryIds = new Map<string, UniqueEntityID>()

  for (const data of CATEGORIES) {
    const category = Category.create({ userId: user.id, ...data })
    await categoriesRepository.create(category)
    categoryIds.set(data.title, category.id)
  }

  for (const { category, monthsAgo, day, ...data } of TRANSACTIONS) {
    const categoryId = categoryIds.get(category)

    if (!categoryId) {
      throw new Error(`Categoria "${category}" não existe no seed.`)
    }

    await transactionsRepository.create(
      Transaction.create({
        userId: user.id,
        categoryId,
        date: calendarDay(monthsAgo, day),
        ...data,
      }),
    )
  }

  console.log(
    `🌱 Seed: ${DEMO_USER.email} / ${DEMO_USER.password} com ` +
      `${CATEGORIES.length} categorias e ${TRANSACTIONS.length} transações.`,
  )
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
