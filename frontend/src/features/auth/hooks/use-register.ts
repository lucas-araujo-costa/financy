import { useApolloClient, useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router'

import { setAuthToken } from '@/lib/auth-token'
import { withViewTransition } from '@/lib/view-transition'
import { runMutation } from '@/services/graphql/run-mutation'

import type { SignUpValues } from '../schemas/sign-up-schema'
import { GetMeQuery } from '../services/get-me'
import { RegisterMutation } from '../services/register'

/** Cria a conta e já entra (o `register` devolve o token) indo para o dashboard. */
export function useRegister() {
  const client = useApolloClient()
  const navigate = useNavigate()
  const [register, { loading }] = useMutation(RegisterMutation)

  async function signUp(input: SignUpValues) {
    return runMutation(
      async () => {
        const { data } = await register({ variables: { input } })
        if (!data) return

        const { accessToken, user } = data.register
        client.writeQuery({ query: GetMeQuery, data: { me: user } })
        // Sem "Lembrar-me" no cadastro: a sessão vale até fechar a aba
        withViewTransition(() => {
          setAuthToken(accessToken, false)
          navigate('/', { replace: true, flushSync: true })
        })
      },
      {
        success: 'Conta criada. Boas-vindas ao Financy!',
        errors: { CONFLICT: 'Este e-mail já está cadastrado.' },
      },
    )
  }

  return { signUp, isSubmitting: loading }
}
