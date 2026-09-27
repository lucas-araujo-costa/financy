import { graphql } from '@/services/graphql/generated'

export const CreateCategoryMutation = graphql(`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`)
