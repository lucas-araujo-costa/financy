import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Pagination Button do Style Guide: default, hover, active e disabled. */
export function PaginationButton({
  className,
  isActive = false,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { isActive?: boolean }) {
  return (
    <button
      data-slot="pagination-button"
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      type={type}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700',
        'transition-[color,background-color,border-color,opacity] duration-fast ease-out hover:bg-gray-200',
        'data-[active=true]:border-brand-base data-[active=true]:bg-brand-base data-[active=true]:text-white',
        'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}
