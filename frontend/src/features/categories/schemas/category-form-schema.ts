import { z } from 'zod'

import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '@/components/shared/category-style'

export const categoryFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título'),
  description: z.string().trim(),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

/** Valores do formulário → `CategoryInput` do contrato (descrição vazia vira null) */
export function toCategoryInput(values: CategoryFormValues) {
  return {
    title: values.title,
    description: values.description || null,
    icon: values.icon,
    color: values.color,
  }
}
