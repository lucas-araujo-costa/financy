import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import { DeleteCategoryMutation } from '../services/delete-category'

export function useDeleteCategory() {
  const [deleteCategory, { loading }] = useMutation(DeleteCategoryMutation, {
    refetchQueries: ['GetCategories'],
    awaitRefetchQueries: true,
  })

  async function remove(id: string) {
    return runMutation(() => deleteCategory({ variables: { id } }), {
      success: 'Categoria excluída.',
      errors: {
        CONFLICT: 'Essa categoria tem transações e não pode ser excluída.',
      },
    })
  }

  return { remove, isPending: loading }
}
