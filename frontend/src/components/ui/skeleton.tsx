import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Placeholder de carregamento: o chamador dá o mesmo tamanho do conteúdo final. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  )
}
