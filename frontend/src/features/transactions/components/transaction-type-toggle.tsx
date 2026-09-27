import { CircleArrowDownIcon, CircleArrowUpIcon } from 'lucide-react'
import { ToggleGroup } from 'radix-ui'

import type { TransactionType } from '@/components/shared/transaction-type-badge'
import { cn } from '@/lib/utils'

/*
 * Toggle Despesa / Receita do modal: o item escolhido ganha fundo gray-100 e
 * borda vermelha (despesa) ou verde (receita), com transição (AGENTS.md › Movimento).
 */

const options = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    icon: CircleArrowDownIcon,
    selected:
      'data-[state=on]:border-red-base [&[data-state=on]_svg]:text-red-base',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    icon: CircleArrowUpIcon,
    selected:
      'data-[state=on]:border-green-base [&[data-state=on]_svg]:text-green-base',
  },
] as const

export function TransactionTypeToggle({
  value,
  onChange,
}: {
  value: TransactionType
  onChange: (value: TransactionType) => void
}) {
  return (
    <ToggleGroup.Root
      type="single"
      aria-label="Tipo da transação"
      value={value}
      // Sempre há um tipo escolhido: clicar no item ativo não desmarca
      onValueChange={(next) => next && onChange(next as TransactionType)}
      className="flex rounded-xl border border-gray-200 p-2"
    >
      {options.map(({ value: optionValue, label, icon: Icon, selected }) => (
        <ToggleGroup.Item
          key={optionValue}
          value={optionValue}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent px-3 py-[13px] text-base leading-[18px] text-gray-600',
            'transition-[color,background-color,border-color] duration-base ease-out hover:text-gray-800',
            'data-[state=on]:bg-gray-100 data-[state=on]:font-medium data-[state=on]:text-gray-800',
            'outline-none focus-visible:ring-2 focus-visible:ring-brand-base/40',
            selected,
          )}
        >
          <Icon
            aria-hidden
            className="size-4 text-gray-400 transition-colors duration-base ease-out"
          />
          {label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
