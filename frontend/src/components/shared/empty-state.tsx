import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Estado vazio (não está no Figma): ícone, título, texto e uma ação opcional. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex animate-in flex-col items-center gap-3 px-6 py-12 text-center duration-slow ease-out fade-in-0',
        className,
      )}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base leading-6 font-medium text-gray-800">{title}</p>
        {description && (
          <p className="text-sm leading-5 text-gray-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
