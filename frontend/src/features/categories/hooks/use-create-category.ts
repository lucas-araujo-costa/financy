import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import {
  type CategoryFormValues,
  toCategoryInput,
} from '../schemas/category-form-schema'
import { CreateCategoryMutation } from '../services/create-category'

export function useCreateCategory() {
  const [createCategory, { loading }] = useMutation(CreateCategoryMutation, {
    refetchQueries: ['GetCategories', 'GetTransactions'],
    awaitRefetchQueries: true,
  })

  async function create(values: CategoryFormValues) {
    return runMutation(
      () => createCategory({ variables: { input: toCategoryInput(values) } }),
      {
        success: 'Categoria criada.',
        errors: { CONFLICT: 'Já existe uma categoria com esse título.' },
      },
    )
  }

  return { create, isSubmitting: loading }
}
