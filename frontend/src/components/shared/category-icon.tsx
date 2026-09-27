import { cn } from '@/lib/utils'

import {
  categoryColorClasses,
  categoryIconComponents,
  toCategoryColor,
  toCategoryIcon,
} from './category-style'

/** Quadrado de 40px com fundo light da cor e o ícone Lucide da categoria. */
export function CategoryIcon({
  icon,
  color,
  className,
}: {
  icon: string
  color: string
  className?: string
}) {
  const Icon = categoryIconComponents[toCategoryIcon(icon)]
  const classes = categoryColorClasses[toCategoryColor(color)]

  return (
    <span
      data-slot="category-icon"
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
        classes.iconBackground,
        classes.icon,
        className,
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}
