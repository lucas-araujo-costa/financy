import { PlusIcon } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { Header } from '@/components/shared/header'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { CategoriesStats } from '@/features/categories/components/categories-stats'
import {
  CategoryCard,
  CategoryCardSkeleton,
} from '@/features/categories/components/category-card'
import { CategoryFormDialog } from '@/features/categories/components/category-form-dialog'
import type { CategoryListItem } from '@/features/categories/types'
import { CategoriesOverviewCard } from '@/features/dashboard/components/categories-overview-card'
import { RecentTransactionsCard } from '@/features/dashboard/components/recent-transactions-card'
import { SummaryCards } from '@/features/dashboard/components/summary-cards'
import { TransactionFormDialog } from '@/features/transactions/components/transaction-form-dialog'
import { TransactionTableFilters } from '@/features/transactions/components/transaction-table-filters'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'
import type { TransactionListItem } from '@/features/transactions/types'

/*
 * Vitrine só de desenvolvimento (rota /_dev/screens, fora do build de produção):
 * monta as telas com os dados de exemplo do Figma para comparar com o layout
 * enquanto a API não está integrada.
 * ?screen=dashboard|transactions|categories&loading=1&open=transaction|category
 */

const categories: CategoryListItem[] = [
  {
    id: 'c1',
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: 'utensils',
    color: 'blue',
    transactionsCount: 12,
    totalInCents: 54230,
  },
  {
    id: 'c2',
    title: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: 'ticket',
    color: 'pink',
    transactionsCount: 2,
    totalInCents: 18620,
  },
  {
    id: 'c3',
    title: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: 'piggy-bank',
    color: 'green',
    transactionsCount: 1,
    totalInCents: 34025,
  },
  {
    id: 'c4',
    title: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: 'shopping-cart',
    color: 'orange',
    transactionsCount: 3,
    totalInCents: 29875,
  },
  {
    id: 'c5',
    title: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: 'briefcase-business',
    color: 'green',
    transactionsCount: 3,
    totalInCents: 1275000,
  },
  {
    id: 'c6',
    title: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: 'heart-pulse',
    color: 'red',
    transactionsCount: 0,
    totalInCents: 0,
  },
  {
    id: 'c7',
    title: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: 'car-front',
    color: 'purple',
    transactionsCount: 8,
    totalInCents: 38550,
  },
  {
    id: 'c8',
    title: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: 'tool-case',
    color: 'yellow',
    transactionsCount: 7,
    totalInCents: 24580,
  },
]

function byTitle(title: string) {
  const category = categories.find((item) => item.title === title)!
  return { id: category.id, title, icon: category.icon, color: category.color }
}

const transactions: TransactionListItem[] = [
  {
    id: 't1',
    description: 'Jantar no Restaurante',
    date: '2025-11-30',
    category: byTitle('Alimentação'),
    type: 'EXPENSE',
    amountInCents: 8950,
  },
  {
    id: 't2',
    description: 'Posto de Gasolina',
    date: '2025-11-29',
    category: byTitle('Transporte'),
    type: 'EXPENSE',
    amountInCents: 10000,
  },
  {
    id: 't3',
    description: 'Compras no Mercado',
    date: '2025-11-28',
    category: byTitle('Mercado'),
    type: 'EXPENSE',
    amountInCents: 15680,
  },
  {
    id: 't4',
    description: 'Retorno de Investimento',
    date: '2025-11-26',
    category: byTitle('Investimento'),
    type: 'INCOME',
    amountInCents: 34025,
  },
  {
    id: 't5',
    description: 'Aluguel',
    date: '2025-11-26',
    category: byTitle('Utilidades'),
    type: 'EXPENSE',
    amountInCents: 170000,
  },
  {
    id: 't6',
    description: 'Freelance',
    date: '2025-11-24',
    category: byTitle('Salário'),
    type: 'INCOME',
    amountInCents: 250000,
  },
  {
    id: 't7',
    description: 'Compras Jantar',
    date: '2025-11-22',
    category: byTitle('Mercado'),
    type: 'EXPENSE',
    amountInCents: 15000,
  },
  {
    id: 't8',
    description: 'Cinema',
    date: '2025-12-18',
    category: byTitle('Entretenimento'),
    type: 'EXPENSE',
    amountInCents: 8800,
  },
]

const noop = () => {}

export function ScreensPreview() {
  const [searchParams] = useSearchParams()
  const screen = searchParams.get('screen') ?? 'dashboard'
  const isLoading = searchParams.get('loading') === '1'
  const open = searchParams.get('open')

  return (
    <div className="min-h-dvh">
      <Header userName="Conta Teste" />
      <main className="px-4 py-8 sm:p-12">
        <div className="mx-auto w-full max-w-[1280px]">
          {screen === 'dashboard' && (
            <div className="grid items-start gap-6 lg:grid-cols-3">
              <SummaryCards
                summary={
                  isLoading
                    ? undefined
                    : {
                        balanceInCents: 1284732,
                        monthIncomeInCents: 425000,
                        monthExpenseInCents: 218045,
                      }
                }
              />
              <div className="lg:col-span-2">
                <RecentTransactionsCard
                  transactions={
                    isLoading ? undefined : transactions.slice(0, 5)
                  }
                  onCreate={noop}
                />
              </div>
              <CategoriesOverviewCard
                categories={isLoading ? undefined : categories}
              />
            </div>
          )}

          {screen === 'transactions' && (
            <div className="flex flex-col gap-8">
              <PageHeader
                title="Transações"
                description="Gerencie todas as suas transações financeiras"
                action={
                  <Button size="sm">
                    <PlusIcon aria-hidden /> Nova transação
                  </Button>
                }
              />
              <TransactionTableFilters categories={categories} />
              <TransactionsTable
                transactions={isLoading ? [] : transactions}
                total={27}
                page={1}
                perPage={isLoading ? 4 : 10}
                onPageChange={noop}
                onEdit={noop}
                onDelete={noop}
                isLoading={isLoading}
              />
            </div>
          )}

          {screen === 'categories' && (
            <div className="flex flex-col gap-8">
              <PageHeader
                title="Categorias"
                description="Organize suas transações por categorias"
                action={
                  <Button size="sm">
                    <PlusIcon aria-hidden /> Nova categoria
                  </Button>
                }
              />
              <CategoriesStats categories={categories} isLoading={isLoading} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading
                  ? Array.from({ length: 4 }, (_, index) => (
                      <CategoryCardSkeleton key={index} />
                    ))
                  : categories.map((category) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        onEdit={noop}
                        onDelete={noop}
                      />
                    ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <TransactionFormDialog
        open={open === 'transaction'}
        onOpenChange={noop}
        categories={categories}
        onSubmit={noop}
      />
      <CategoryFormDialog
        open={open === 'category'}
        onOpenChange={noop}
        onSubmit={noop}
      />
    </div>
  )
}
