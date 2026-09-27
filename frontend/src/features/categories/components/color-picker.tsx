import { RadioGroup } from 'radix-ui'

import {
  CATEGORY_COLORS,
  type CategoryColorName,
  categoryColorClasses,
} from '@/components/shared/category-style'
import { cn } from '@/lib/utils'

const colorLabels: Record<CategoryColorName, string> = {
  green: 'Verde',
  blue: 'Azul',
  purple: 'Roxo',
  pink: 'Rosa',
  red: 'Vermelho',
  orange: 'Laranja',
  yellow: 'Amarelo',
}

/** As 7 cores do modal "Nova categoria", na ordem do Figma (docs/api-contract.md › Listas fixas). */
export function ColorPicker({
  id,
  value,
  onChange,
}: {
  id?: string
  value: CategoryColorName
  onChange: (color: CategoryColorName) => void
}) {
  return (
    <RadioGroup.Root
      id={id}
      aria-label="Cor"
      value={value}
      onValueChange={(color) => onChange(color as CategoryColorName)}
      className="grid grid-cols-7 gap-2"
    >
      {CATEGORY_COLORS.map((color) => (
        <RadioGroup.Item
          key={color}
          value={color}
          aria-label={colorLabels[color]}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white p-1 transition-[border-color,background-color] duration-base ease-out outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-brand-base/40 data-[state=checked]:border-brand-base data-[state=checked]:bg-gray-100"
        >
          <span
            className={cn(
              'block h-5 rounded-md',
              categoryColorClasses[color].swatch,
            )}
          />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
