import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Tag do Style Guide: fundo light e texto dark de cada cor, ou cinza. */
const tagVariants = cva(
  'inline-flex max-w-full items-center truncate rounded-full px-3 py-1 text-sm leading-5 font-medium transition-colors duration-fast ease-out',
  {
    variants: {
      color: {
        gray: 'bg-gray-200 text-gray-700',
        blue: 'bg-blue-light text-blue-dark',
        purple: 'bg-purple-light text-purple-dark',
        pink: 'bg-pink-light text-pink-dark',
        red: 'bg-red-light text-red-dark',
        orange: 'bg-orange-light text-orange-dark',
        yellow: 'bg-yellow-light text-yellow-dark',
        green: 'bg-green-light text-green-dark',
      },
    },
    defaultVariants: {
      color: 'gray',
    },
  },
)

export type TagColor = NonNullable<VariantProps<typeof tagVariants>['color']>

export function Tag({
  className,
  color,
  ...props
}: Omit<ComponentProps<'span'>, 'color'> & VariantProps<typeof tagVariants>) {
  return (
    <span
      data-slot="tag"
      className={cn(tagVariants({ color }), className)}
      {...props}
    />
  )
}
