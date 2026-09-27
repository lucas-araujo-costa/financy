import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Estado "Select" do Input no Style Guide: o gatilho tem a mesma caixa do
 * TextInput, e o dropdown é um card branco com sombra, 8px abaixo do gatilho.
 * Abre e fecha com fade + deslize curto, e o chevron gira (AGENTS.md › Movimento).
 */

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  children,
  invalid = false,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & { invalid?: boolean }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-invalid={invalid}
      className={cn(
        'group/select flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] text-left text-base leading-[18px] text-gray-800',
        'transition-[border-color,box-shadow,opacity] duration-fast ease-out',
        'outline-none focus-visible:border-brand-base data-[invalid=true]:border-danger data-[state=open]:border-brand-base',
        'disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-gray-400',
        '[&>span]:line-clamp-1 [&>span]:flex-1 [&>svg]:size-4 [&>svg]:shrink-0',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          aria-hidden
          className="text-gray-800 transition-transform duration-base ease-out group-data-[state=open]/select:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  sideOffset = 8,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          'relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto',
          'rounded-lg border border-gray-300 bg-white shadow-[0_4px_7.5px_rgba(0,0,0,0.1)]',
          'data-[state=open]:animate-in data-[state=open]:duration-base data-[state=open]:ease-out data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:duration-fast data-[state=closed]:ease-in data-[state=closed]:fade-out-0',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="flex flex-col gap-1 px-[5px] py-[7px]">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-base leading-[18px] text-gray-800 outline-none select-none',
        'transition-colors duration-fast ease-out data-[highlighted]:bg-gray-100 data-[state=checked]:font-medium',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto animate-in duration-fast fade-in-0">
        <CheckIcon aria-hidden className="size-5 text-success" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
