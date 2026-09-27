import { useState } from 'react'

import { formatLocalDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

/*
 * Campo "Data" do modal de transação: caixa igual ao TextInput que abre o
 * calendário num popover. Trabalha com Date local; a conversão para o ISO do
 * contrato fica no formulário (lib/format: toCalendarDate).
 */

interface DatePickerProps {
  id?: string
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  defaultOpen?: boolean
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Selecione',
  invalid = false,
  disabled = false,
  defaultOpen = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        data-invalid={invalid}
        className={cn(
          'flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white px-[13px] text-left text-base leading-[18px]',
          'transition-[border-color,box-shadow,opacity] duration-fast ease-out',
          'outline-none focus-visible:border-brand-base data-[invalid=true]:border-danger data-[state=open]:border-brand-base',
          'disabled:cursor-not-allowed disabled:opacity-50',
          value ? 'text-gray-800' : 'text-gray-400',
        )}
      >
        <span className="flex-1 truncate">
          {value ? formatLocalDate(value) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          autoFocus
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange(date)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
