import { graphql } from '@/services/graphql/generated'

// Devolve o User com id: o Apollo atualiza o cache sozinho (architecture.md › Cache)
export const EditProfileMutation = graphql(`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      id
      name
      email
    }
  }
`)
