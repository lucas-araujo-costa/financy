import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'

import { cn } from '@/lib/utils'

const navButton = cn(
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-700',
  'transition-colors duration-fast ease-out hover:bg-gray-200 disabled:opacity-50',
  'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40',
)

/*
 * Calendário do date picker (react-day-picker, via shadcn), em pt-BR e com os
 * tokens do Style Guide. O Figma não desenha o calendário aberto.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col',
        month: 'flex flex-col gap-4',
        month_caption: 'flex h-8 items-center justify-center',
        caption_label:
          'text-sm leading-5 font-semibold text-gray-800 first-letter:uppercase',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: navButton,
        button_next: navButton,
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'w-9 text-xs leading-4 font-medium text-gray-500 uppercase select-none',
        week: 'mt-1 flex w-full',
        day: 'size-9 p-0 text-center',
        day_button: cn(
          'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 text-gray-800',
          'transition-colors duration-fast ease-out hover:bg-gray-100',
          'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40',
        ),
        selected:
          '[&>button]:bg-brand-base [&>button]:font-medium [&>button]:text-white [&>button]:hover:bg-brand-dark',
        today: '[&>button]:font-semibold [&>button]:text-brand-base',
        outside: '[&>button]:text-gray-400',
        disabled: '[&>button]:pointer-events-none [&>button]:opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className={cn('size-4', chevronClassName)} />
          ) : (
            <ChevronRightIcon className={cn('size-4', chevronClassName)} />
          ),
      }}
      {...props}
    />
  )
}
