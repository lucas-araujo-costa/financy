import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Divisor horizontal com texto opcional no meio (ex.: "ou" no login). */
export function Divider({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="divider"
      role="separator"
      className={cn('flex w-full items-center gap-3', className)}
      {...props}
    >
      <span className="h-px flex-1 bg-gray-300" />
      {children && (
        <>
          <span className="text-sm leading-5 text-gray-500">{children}</span>
          <span className="h-px flex-1 bg-gray-300" />
        </>
      )}
    </div>
  )
}
