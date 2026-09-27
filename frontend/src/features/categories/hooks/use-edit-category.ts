import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import {
  type CategoryFormValues,
  toCategoryInput,
} from '../schemas/category-form-schema'
import { EditCategoryMutation } from '../services/edit-category'

// A tag e o ícone também aparecem na tabela de transações (architecture.md › Cache)
export function useEditCategory() {
  const [editCategory, { loading }] = useMutation(EditCategoryMutation, {
    refetchQueries: ['GetCategories', 'GetTransactions'],
    awaitRefetchQueries: true,
  })

  async function edit(id: string, values: CategoryFormValues) {
    return runMutation(
      () => editCategory({ variables: { id, input: toCategoryInput(values) } }),
      {
        success: 'Categoria atualizada.',
        errors: { CONFLICT: 'Já existe uma categoria com esse título.' },
      },
    )
  }

  return { edit, isSubmitting: loading }
}
