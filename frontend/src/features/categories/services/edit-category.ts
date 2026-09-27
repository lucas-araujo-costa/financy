import { graphql } from '@/services/graphql/generated'

export const EditCategoryMutation = graphql(`
  mutation EditCategory($id: ID!, $input: CategoryInput!) {
    editCategory(id: $id, input: $input) {
      id
    }
  }
`)
