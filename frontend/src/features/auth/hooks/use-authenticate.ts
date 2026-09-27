import { useApolloClient, useMutation } from '@apollo/client/react'

import { setAuthToken } from '@/lib/auth-token'
import { withViewTransition } from '@/lib/view-transition'
import { runMutation } from '@/services/graphql/run-mutation'

import type { SignInValues } from '../schemas/sign-in-schema'
import { AuthenticateMutation } from '../services/authenticate'
import { GetMeQuery } from '../services/get-me'

export function useAuthenticate() {
  const client = useApolloClient()
  const [authenticate, { loading }] = useMutation(AuthenticateMutation)

  async function signIn({ email, password, remember }: SignInValues) {
    return runMutation(
      async () => {
        const { data } = await authenticate({
          variables: { input: { email, password } },
        })
        if (!data) return

        const { accessToken, user } = data.authenticate
        // O header já nasce com o nome, sem esperar a query `me`
        client.writeQuery({ query: GetMeQuery, data: { me: user } })
        // Crossfade do login para o dashboard na mesma rota "/" (AGENTS.md › Movimento)
        withViewTransition(() => setAuthToken(accessToken, remember))
      },
      // Senha errada e e-mail inexistente têm a mesma mensagem (docs/api-contract.md › Erros)
      { errors: { UNAUTHENTICATED: 'E-mail ou senha incorretos.' } },
    )
  }

  return { signIn, isSubmitting: loading }
}
