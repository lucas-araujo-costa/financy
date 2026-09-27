import { ChevronRightIcon, TagIcon } from 'lucide-react'
import { Link as RouterLink } from 'react-router'

import { CategoryTag } from '@/components/shared/category-tag'
import { EmptyState } from '@/components/shared/empty-state'
import { Card, CardLabel } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { Skeleton } from '@/components/ui/skeleton'
import {
  type CategoryListItem,
  formatItemsCount,
  getMostUsedCategories,
} from '@/features/categories'
import { formatCurrency } from '@/lib/format'

/** Card "Categorias" do dashboard: as 5 mais usadas, com itens e total. */
export function CategoriesOverviewCard({
  categories,
}: {
  categories: CategoryListItem[] | undefined
}) {
  const topCategories = categories && getMostUsedCategories(categories, 5)

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <CardLabel>Categorias</CardLabel>
        <Link asChild>
          <RouterLink to="/categorias" viewTransition>
            Gerenciar
            <ChevronRightIcon aria-hidden />
          </RouterLink>
        </Link>
      </div>

      {topCategories?.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="Sem movimentação"
          description="As categorias mais usadas aparecem aqui."
        />
      ) : (
        <ul className="flex flex-col gap-5 p-6">
          {topCategories
            ? topCategories.map((category) => (
                <li
                  key={category.id}
                  className="flex animate-in items-center gap-1 duration-slow ease-out fade-in-0"
                >
                  <CategoryTag title={category.title} color={category.color} />
                  <span className="flex-1 text-right text-sm leading-5 text-gray-600">
                    {formatItemsCount(category.transactionsCount)}
                  </span>
                  <span className="min-w-[88px] shrink-0 pl-3 text-right text-sm leading-5 font-semibold whitespace-nowrap text-gray-800">
                    {formatCurrency(category.totalInCents)}
                  </span>
                </li>
              ))
            : Array.from({ length: 5 }, (_, index) => (
                <li key={index} aria-hidden className="flex items-center gap-4">
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="ml-auto h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </li>
              ))}
        </ul>
      )}
    </Card>
  )
}
