import { Tag } from '@/components/ui/tag'

import { categoryColorClasses, toCategoryColor } from './category-style'

/** Tag com o título da categoria na cor dela. */
export function CategoryTag({
  title,
  color,
  className,
}: {
  title: string
  color: string
  className?: string
}) {
  return (
    <Tag
      color={categoryColorClasses[toCategoryColor(color)].tag}
      className={className}
    >
      {title}
    </Tag>
  )
}
