import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Input composto do Style Guide:
 *   <TextInput.Root invalid?>
 *     <TextInput.Icon><Mail /></TextInput.Icon>
 *     <TextInput.Field id="email" placeholder="mail@exemplo.com" />
 *     <TextInput.Action aria-label="Mostrar senha">...</TextInput.Action>
 *   </TextInput.Root>
 *
 * Estados: empty (ícone gray-400), filled (ícone gray-800), active (foco:
 * ícone e borda brand), error (ícone e borda danger) e disabled (50%).
 * "Filled" vem do CSS (:placeholder-shown), então o campo sempre tem placeholder.
 */

function Root({
  className,
  invalid = false,
  ...props
}: ComponentProps<'div'> & { invalid?: boolean }) {
  return (
    <div
      data-slot="text-input"
      data-invalid={invalid}
      className={cn(
        'group/input flex h-12 w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px]',
        'transition-[border-color,box-shadow,opacity] duration-fast ease-out',
        'focus-within:border-brand-base data-[invalid=true]:border-danger',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function Icon({ className, ...props }: ComponentProps<typeof Slot.Root>) {
  return (
    <Slot.Root
      data-slot="text-input-icon"
      aria-hidden
      className={cn(
        'size-4 shrink-0 text-gray-400 transition-colors duration-fast ease-out',
        'group-has-[input:not(:placeholder-shown)]/input:text-gray-800',
        'group-focus-within/input:text-brand-base!',
        'group-data-[invalid=true]/input:text-danger!',
        className,
      )}
      {...props}
    />
  )
}

function Field({
  className,
  placeholder = ' ',
  ...props
}: ComponentProps<'input'>) {
  return (
    <input
      data-slot="text-input-field"
      placeholder={placeholder}
      className={cn(
        'h-full min-w-0 flex-1 bg-transparent text-base leading-[18px] text-gray-800 caret-brand-base outline-none',
        'placeholder:text-gray-400 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

function Action({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { 'aria-label': string }) {
  return (
    <button
      data-slot="text-input-action"
      type={type}
      className={cn(
        'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs text-gray-800',
        'transition-colors duration-fast ease-out hover:text-brand-base',
        'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40',
        '[&_svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}

export const TextInput = { Root, Icon, Field, Action }
