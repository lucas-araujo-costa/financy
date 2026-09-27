import { useMutation } from '@apollo/client/react'

import { runMutation } from '@/services/graphql/run-mutation'

import type { ProfileValues } from '../schemas/profile-schema'
import { EditProfileMutation } from '../services/edit-profile'

// Sem refetch: o User volta com id e o Apollo atualiza o cache (architecture.md › Cache)
export function useEditProfile() {
  const [editProfile, { loading }] = useMutation(EditProfileMutation)

  async function save(input: ProfileValues) {
    return runMutation(() => editProfile({ variables: { input } }), {
      success: 'Perfil atualizado.',
    })
  }

  return { save, isSubmitting: loading }
}
