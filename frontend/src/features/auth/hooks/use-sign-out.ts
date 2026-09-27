import { useApolloClient } from '@apollo/client/react'
import { useNavigate } from 'react-router'

import { clearAuthToken } from '@/lib/auth-token'
import { withViewTransition } from '@/lib/view-transition'

/*
 * Sai da conta com crossfade para o login em "/" (AGENTS.md › Movimento) e limpa o cache
 * do Apollo, para o próximo usuário não ver dados do anterior (architecture.md › Cache).
 */
export function useSignOut() {
  const client = useApolloClient()
  const navigate = useNavigate()

  return function signOut() {
    withViewTransition(() => {
      clearAuthToken()
      navigate('/', { replace: true, flushSync: true })
    })
    client.clearStore()
  }
}
