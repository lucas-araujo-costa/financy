import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Link } from '@/components/ui/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TextInput } from '@/components/ui/text-input'
import { fromCalendarDate } from '@/lib/format'

import {
  type TransactionFormValues,
  transactionFormSchema,
} from '../schemas/transaction-form-schema'
import type { CategoryOption, TransactionListItem } from '../types'
import { CurrencyInput } from './currency-input'
import { TransactionTypeToggle } from './transaction-type-toggle'

/*
 * Modal "Nova transação" do Figma, reaproveitado para editar (docs/decisions.md, ADR-13):
 * título "Editar transação" e campos preenchidos.
 */

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Presente = edição */
  transaction?: TransactionListItem | null
  categories: CategoryOption[]
  onSubmit: (values: TransactionFormValues) => Promise<unknown> | void
  isSubmitting?: boolean
  /** Botão que abre o modal (opcional; também pode ser controlado de fora) */
  trigger?: ReactNode
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  categories,
  onSubmit,
  isSubmitting,
  trigger,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader
          title={isEditing ? 'Editar transação' : 'Nova transação'}
          description="Registre sua despesa ou receita"
        />
        {/* O conteúdo desmonta ao fechar, então o formulário sempre abre com os valores certos */}
        <TransactionForm
          transaction={transaction}
          categories={categories}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}

function TransactionForm({
  transaction,
  categories,
  onSubmit,
  isSubmitting = false,
}: Pick<
  TransactionFormDialogProps,
  'transaction' | 'categories' | 'onSubmit' | 'isSubmitting'
>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          description: transaction.description,
          date: fromCalendarDate(transaction.date),
          amountInCents: transaction.amountInCents,
          categoryId: transaction.category.id,
        }
      : { type: 'EXPENSE', description: '' },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <TransactionTypeToggle
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex flex-col gap-4">
        <Field
          label="Descrição"
          htmlFor="description"
          error={errors.description?.message}
        >
          <TextInput.Root invalid={Boolean(errors.description)}>
            <TextInput.Field
              id="description"
              placeholder="Ex. Almoço no restaurante"
              aria-invalid={Boolean(errors.description)}
              aria-describedby="description-message"
              {...register('description')}
            />
          </TextInput.Root>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Data" htmlFor="date" error={errors.date?.message}>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="date"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.date)}
                />
              )}
            />
          </Field>

          <Field
            label="Valor"
            htmlFor="amount"
            error={errors.amountInCents?.message}
          >
            <Controller
              control={control}
              name="amountInCents"
              render={({ field }) => (
                <CurrencyInput
                  id="amount"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  invalid={Boolean(errors.amountInCents)}
                  aria-invalid={Boolean(errors.amountInCents)}
                  aria-describedby="amount-message"
                />
              )}
            />
          </Field>
        </div>

        <Field
          label="Categoria"
          htmlFor="category"
          error={errors.categoryId?.message}
          helper={
            categories.length === 0 && (
              <>
                Você ainda não tem categorias.{' '}
                <Link asChild className="text-xs leading-4">
                  <RouterLink to="/categorias" viewTransition>
                    Criar categoria
                  </RouterLink>
                </Link>
              </>
            )
          }
        >
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={field.onChange}
                disabled={categories.length === 0}
              >
                <SelectTrigger
                  id="category"
                  ref={field.ref}
                  invalid={Boolean(errors.categoryId)}
                  aria-invalid={Boolean(errors.categoryId)}
                  aria-describedby="category-message"
                >
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
