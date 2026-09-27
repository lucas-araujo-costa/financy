import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'

import { env } from '@/env'
import { clearAuthToken, getAuthToken } from '@/lib/auth-token'

import { getErrorCode } from './api-error'

/*
 * Senha errada também volta como UNAUTHENTICATED (docs/api-contract.md › Erros). Nessas operações
 * o erro é do formulário, não uma sessão expirada.
 */
const PUBLIC_OPERATIONS = new Set(['Authenticate', 'Register'])

const httpLink = new HttpLink({ uri: env.VITE_BACKEND_URL })

const authLink = new SetContextLink((prevContext) => {
  const token = getAuthToken()
  if (!token) return {}

  return {
    headers: {
      ...prevContext.headers,
      Authorization: `Bearer ${token}`,
    },
  }
})

const errorLink = new ErrorLink(({ error, operation }) => {
  if (PUBLIC_OPERATIONS.has(operation.operationName ?? '')) return

  if (getErrorCode(error) === 'UNAUTHENTICATED') {
    // Os layouts assinam o token e levam o usuário para "/" (sem reload).
    // O cache sai junto, para o próximo login não ver dados deste usuário.
    clearAuthToken()
    apolloClient.clearStore()
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
