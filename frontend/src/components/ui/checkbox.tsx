import { CheckIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Checkbox 16px do login ("Lembrar-me"). Marcado: fundo brand com check branco. */
export function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-300 bg-white text-white',
        'transition-[background-color,border-color,box-shadow] duration-fast ease-out hover:border-gray-400',
        'data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base',
        'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        forceMount
        className="transition-[opacity,scale] duration-fast ease-out data-[state=checked]:scale-100 data-[state=checked]:opacity-100 data-[state=unchecked]:scale-50 data-[state=unchecked]:opacity-0"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
