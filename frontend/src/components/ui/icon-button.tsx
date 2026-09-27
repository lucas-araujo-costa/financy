import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Icon Button do Style Guide: Outline e Danger, 32×32 com ícone de 16px. */
const iconButtonVariants = cva(
  [
    'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white',
    'transition-[color,background-color,opacity,box-shadow] duration-fast ease-out hover:bg-gray-200',
    'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        outline: 'text-gray-700',
        danger: 'text-danger',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  },
)

interface IconButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof iconButtonVariants> {
  /** Obrigatório: o botão só tem ícone, então o nome acessível vem daqui */
  'aria-label': string
}

export function IconButton({
  className,
  variant,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      data-slot="icon-button"
      type={type}
      className={cn(iconButtonVariants({ variant }), className)}
      {...props}
    />
  )
}
