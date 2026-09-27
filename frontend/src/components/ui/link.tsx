import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/**
 * Link do Style Guide (texto brand, sublinhado no hover).
 * Use `asChild` para envolver o `Link` do React Router ou um `button`.
 */
export function Link({
  className,
  asChild = false,
  ...props
}: ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'a'

  return (
    <Comp
      data-slot="link"
      className={cn(
        'inline-flex cursor-pointer items-center gap-1 border-b border-transparent text-sm leading-5 font-medium text-brand-base',
        'transition-[color,border-color] duration-fast ease-out hover:border-brand-base',
        'rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
        '[&_svg]:size-5 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}
