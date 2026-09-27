import { RadioGroup } from 'radix-ui'

import {
  CATEGORY_ICONS,
  type CategoryIconName,
  categoryIconComponents,
} from '@/components/shared/category-style'

/** Grade 8×2 dos 16 ícones do modal "Nova categoria" (docs/api-contract.md › Listas fixas). */
export function IconPicker({
  id,
  value,
  onChange,
}: {
  id?: string
  value: CategoryIconName
  onChange: (icon: CategoryIconName) => void
}) {
  return (
    <RadioGroup.Root
      id={id}
      aria-label="Ícone"
      value={value}
      onValueChange={(icon) => onChange(icon as CategoryIconName)}
      className="grid grid-cols-8 gap-2 sm:grid-cols-[repeat(8,42px)]"
    >
      {CATEGORY_ICONS.map((icon) => {
        const Icon = categoryIconComponents[icon]

        return (
          <RadioGroup.Item
            key={icon}
            value={icon}
            aria-label={icon}
            className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-[color,background-color,border-color] duration-base ease-out outline-none hover:bg-gray-100 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-brand-base/40 data-[state=checked]:border-brand-base data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-800"
          >
            <Icon aria-hidden className="size-5" />
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
