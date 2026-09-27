import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  toCategoryColor,
  toCategoryIcon,
} from '@/components/shared/category-style'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'

import {
  type CategoryFormValues,
  categoryFormSchema,
} from '../schemas/category-form-schema'
import type { CategoryListItem } from '../types'
import { ColorPicker } from './color-picker'
import { IconPicker } from './icon-picker'

/*
 * Modal "Nova categoria" (docs/api-contract.md › Listas fixas): Título, Descrição (opcional), Ícone e Cor.
 * O primeiro ícone e a primeira cor já vêm selecionados. Reaproveitado para
 * editar, com título "Editar categoria".
 */

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryListItem | null
  onSubmit: (values: CategoryFormValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting,
}: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title={category ? 'Editar categoria' : 'Nova categoria'}
          description="Organize suas transações com categorias"
        />
        <CategoryForm
          category={category}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}

function CategoryForm({
  category,
  onSubmit,
  isSubmitting = false,
}: Pick<CategoryFormDialogProps, 'category' | 'onSubmit' | 'isSubmitting'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category
      ? {
          title: category.title,
          description: category.description ?? '',
          icon: toCategoryIcon(category.icon),
          color: toCategoryColor(category.color),
        }
      : {
          title: '',
          description: '',
          icon: CATEGORY_ICONS[0],
          color: CATEGORY_COLORS[0],
        },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <Field label="Título" htmlFor="title" error={errors.title?.message}>
          <TextInput.Root invalid={Boolean(errors.title)}>
            <TextInput.Field
              id="title"
              placeholder="Ex. Alimentação"
              aria-invalid={Boolean(errors.title)}
              aria-describedby="title-message"
              {...register('title')}
            />
          </TextInput.Root>
        </Field>

        <Field label="Descrição" htmlFor="description" helper="Opcional">
          <TextInput.Root>
            <TextInput.Field
              id="description"
              placeholder="Descrição da categoria"
              {...register('description')}
            />
          </TextInput.Root>
        </Field>

        <Field label="Ícone" htmlFor="icon">
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <IconPicker
                id="icon"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Cor" htmlFor="color">
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <ColorPicker
                id="color"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Salvar
      </Button>
    </form>
  )
}
