import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/* Mesmo card do dropdown do Select. Fade + deslize a partir do lado em que abre. */

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

function PopoverContent({
  className,
  align = 'start',
  sideOffset = 8,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 origin-(--radix-popover-content-transform-origin) rounded-lg border border-gray-300 bg-white shadow-[0_4px_7.5px_rgba(0,0,0,0.1)] outline-none',
          'data-[state=open]:animate-in data-[state=open]:duration-base data-[state=open]:ease-out data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:duration-fast data-[state=closed]:ease-in data-[state=closed]:fade-out-0',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
