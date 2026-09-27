import { useQuery } from '@apollo/client/react'

import { GetMeQuery } from '../services/get-me'
import { useAuthToken } from './use-auth-token'

/** Usuário logado (query `me`). Sem token, nem pergunta ao backend. */
export function useSession() {
  const token = useAuthToken()
  const { data, loading } = useQuery(GetMeQuery, { skip: !token })

  return {
    user: data?.me,
    isAuthenticated: Boolean(token),
    isLoading: loading,
  }
}
