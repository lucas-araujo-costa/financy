import { ArrowUpDownIcon, TagIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { CategoryIcon } from '@/components/shared/category-icon'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import type { CategoryListItem } from '../types'
import { getCategoriesStats } from '../utils/categories-stats'

/*
 * Os 3 cards do topo da tela de Categorias (docs/decisions.md, ADR-13). Seguem o formato dos
 * cards de resumo do dashboard: ícone + valor em destaque + legenda.
 */
export function CategoriesStats({
  categories,
  isLoading = false,
}: {
  categories: CategoryListItem[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} aria-hidden className="flex items-start gap-4 p-6">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-36" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const { totalCategories, totalTransactions, mostUsed } =
    getCategoriesStats(categories)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        icon={<TagIcon aria-hidden className="size-6 text-gray-700" />}
        value={String(totalCategories)}
        label="Total de categorias"
      />
      <StatCard
        icon={
          <ArrowUpDownIcon aria-hidden className="size-6 text-purple-base" />
        }
        value={String(totalTransactions)}
        label="Total de transações"
      />
      <StatCard
        icon={
          mostUsed ? (
            <CategoryIcon
              icon={mostUsed.icon}
              color={mostUsed.color}
              className="size-8 bg-transparent [&_svg]:size-6"
            />
          ) : (
            <TagIcon aria-hidden className="size-6 text-gray-400" />
          )
        }
        value={mostUsed?.title ?? '—'}
        label="Categoria mais utilizada"
      />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: string
  label: string
}) {
  return (
    <Card className="flex animate-in items-start gap-4 p-6 duration-slow ease-out fade-in-0">
      <span className="flex size-8 shrink-0 items-center justify-center">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="truncate text-[28px] leading-8 font-bold text-gray-800">
          {value}
        </p>
        <p className="text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase">
          {label}
        </p>
      </div>
    </Card>
  )
}
