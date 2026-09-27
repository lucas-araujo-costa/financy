import type { ComponentProps } from 'react'
import { NavLink as RouterNavLink } from 'react-router'

import { cn } from '@/lib/utils'

/*
 * Item da nav do header: ativo em brand-base semibold, inativo gray-600.
 * A cor transiciona. O texto em negrito fica reservado num pseudo-elemento
 * invisível, então a troca de peso não empurra os vizinhos.
 */
export function NavLink({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof RouterNavLink>, 'children' | 'className'> & {
  children: string
  className?: string
}) {
  return (
    <RouterNavLink
      viewTransition
      data-text={children}
      className={({ isActive }) =>
        cn(
          'inline-flex flex-col items-center text-sm leading-5 transition-colors duration-fast ease-out',
          'after:invisible after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-text)]',
          'rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40 focus-visible:ring-offset-2',
          isActive
            ? 'font-semibold text-brand-base'
            : 'text-gray-600 hover:text-gray-800',
          className,
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  )
}
