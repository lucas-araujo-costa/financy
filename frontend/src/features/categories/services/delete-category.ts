import { graphql } from '@/services/graphql/generated'

export const DeleteCategoryMutation = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`)
