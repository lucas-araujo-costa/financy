import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Label Button do Style Guide: Solid (primary) e Outline, tamanhos Md e Sm,
 * estados default, hover e disabled.
 */
const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none',
    'transition-[color,background-color,border-color,opacity,box-shadow] duration-fast ease-out',
    'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand-base text-white hover:bg-brand-dark',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-200',
        // Não está no Style Guide: confirmação de exclusão (docs/decisions.md, ADR-13)
        danger: 'bg-danger text-white hover:bg-red-dark',
      },
      size: {
        md: 'h-12 px-4 text-base leading-6 [&_svg]:size-[18px]',
        sm: 'h-9 px-3 text-sm leading-5 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * Mostra o spinner mantendo o texto e a largura (AGENTS.md › Movimento).
   * O spinner fica no padding da esquerda, então é pensado para os botões
   * de envio de largura total do Figma (Entrar, Cadastrar, Salvar).
   */
  isLoading?: boolean
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)

  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading && (
        <LoaderCircle
          aria-hidden
          className={cn(
            'absolute animate-in animate-spin duration-fast fade-in-0',
            size === 'sm' ? 'left-3' : 'left-4',
          )}
        />
      )}
      {children}
    </button>
  )
}

export { buttonVariants }
