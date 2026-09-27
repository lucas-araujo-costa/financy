import { UserRoundIcon } from 'lucide-react'

import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Círculo gray-300 com as iniciais do usuário (header e perfil). */
export function UserAvatar({
  name,
  className,
}: {
  name?: string
  className?: string
}) {
  const initials = name ? getInitials(name) : ''

  return (
    <span
      data-slot="user-avatar"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-sm leading-5 font-medium text-gray-800 select-none',
        className,
      )}
    >
      {initials || <UserRoundIcon aria-hidden className="size-4" />}
    </span>
  )
}
