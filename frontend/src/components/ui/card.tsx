import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Card branco com borda gray-200 e raio de 12px, como em todas as telas. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl border border-gray-200 bg-white', className)}
      {...props}
    />
  )
}

/** Título de seção em caixa alta (ex.: "SALDO TOTAL", "TRANSAÇÕES RECENTES") */
export function CardLabel({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="card-label"
      className={cn(
        'text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase',
        className,
      )}
      {...props}
    />
  )
}
