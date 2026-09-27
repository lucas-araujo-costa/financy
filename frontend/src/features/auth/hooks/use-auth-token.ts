import { useSyncExternalStore } from 'react'

import { getAuthToken, subscribeAuthToken } from '@/lib/auth-token'

/** Token atual; re-renderiza quando alguém entra ou sai (inclusive o link de erro). */
export function useAuthToken() {
  return useSyncExternalStore(subscribeAuthToken, getAuthToken)
}
