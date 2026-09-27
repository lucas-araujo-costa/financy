import { SquarePenIcon, TrashIcon } from 'lucide-react'

import { CategoryIcon } from '@/components/shared/category-icon'
import { CategoryTag } from '@/components/shared/category-tag'
import { Card } from '@/components/ui/card'
import { IconButton } from '@/components/ui/icon-button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import type { CategoryListItem } from '../types'
import { formatItemsCount } from '../utils/categories-stats'

interface CategoryCardProps {
  category: CategoryListItem
  onEdit: (category: CategoryListItem) => void
  onDelete: (category: CategoryListItem) => void
  isRemoving?: boolean
}

/** Card da grade de categorias: ícone, ações, título, descrição, tag e "N itens". */
export function CategoryCard({
  category,
  onEdit,
  onDelete,
  isRemoving = false,
}: CategoryCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-5 p-6 transition-colors duration-fast ease-out hover:border-gray-300',
        'animate-in duration-slow ease-out fade-in-0',
        isRemoving && 'pointer-events-none opacity-0 duration-base ease-in',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon icon={category.icon} color={category.color} />
        <div className="flex gap-2">
          <IconButton
            variant="danger"
            aria-label={`Excluir "${category.title}"`}
            onClick={() => onDelete(category)}
          >
            <TrashIcon />
          </IconButton>
          <IconButton
            aria-label={`Editar "${category.title}"`}
            onClick={() => onEdit(category)}
          >
            <SquarePenIcon />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="truncate text-base leading-6 font-semibold text-gray-800">
          {category.title}
        </h3>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <CategoryTag title={category.title} color={category.color} />
        <span className="shrink-0 text-sm leading-5 text-gray-600">
          {formatItemsCount(category.transactionsCount)}
        </span>
      </div>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Card aria-hidden className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="my-0.5 h-5 w-2/3" />
        <div className="flex min-h-10 flex-col gap-1 py-0.5">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-4 w-14" />
      </div>
    </Card>
  )
}
