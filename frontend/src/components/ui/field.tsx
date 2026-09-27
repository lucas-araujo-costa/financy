import type { ReactNode } from 'react'

import { usePresence } from '@/hooks/use-presence'
import { cn } from '@/lib/utils'

/*
 * Label + controle + helper/erro, com os estados do Input do Style Guide:
 * o label fica brand no foco e danger no erro. A mensagem de erro entra e sai
 * com fade + deslize curto (AGENTS.md › Movimento).
 */

interface FieldProps {
  label: string
  htmlFor: string
  helper?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}

const EXIT_MS = 150

export function Field({
  label,
  htmlFor,
  helper,
  error,
  className,
  children,
}: FieldProps) {
  const message = usePresence(error, EXIT_MS)
  const isInvalid = Boolean(error)

  return (
    <div
      data-slot="field"
      data-invalid={isInvalid}
      className={cn('group/field flex w-full flex-col gap-2', className)}
    >
      <label
        htmlFor={htmlFor}
        className={cn(
          'text-sm leading-5 font-medium transition-colors duration-fast ease-out',
          isInvalid
            ? 'text-danger'
            : 'text-gray-700 group-focus-within/field:text-brand-base',
        )}
      >
        {label}
      </label>

      {children}

      {message.value ? (
        <p
          id={`${htmlFor}-message`}
          role="alert"
          data-state={message.state}
          className={cn(
            'text-xs leading-4 text-danger',
            'data-[state=open]:animate-in data-[state=open]:duration-base data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1',
            'data-[state=closed]:animate-out data-[state=closed]:duration-fast data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards data-[state=closed]:slide-out-to-top-1',
          )}
        >
          {message.value}
        </p>
      ) : (
        helper && (
          <p
            id={`${htmlFor}-message`}
            className="text-xs leading-4 text-gray-500"
          >
            {helper}
          </p>
        )
      )}
    </div>
  )
}
