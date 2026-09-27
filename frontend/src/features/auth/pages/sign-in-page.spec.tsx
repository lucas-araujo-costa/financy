import { MockedProvider } from '@apollo/client/testing/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { GraphQLError } from 'graphql'
import type { ComponentProps } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getAuthToken } from '@/lib/auth-token'

import { AuthenticateMutation } from '../services/authenticate'
import { SignInPage } from './sign-in-page'

const credentials = { email: 'conta@teste.com', password: 'senha-errada' }

type Mocks = ComponentProps<typeof MockedProvider>['mocks']

function renderPage(mocks: Mocks) {
  const router = createMemoryRouter([{ path: '/', element: <SignInPage /> }])
  render(
    <MockedProvider mocks={mocks}>
      <RouterProvider router={router} />
    </MockedProvider>,
  )
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('E-mail'), {
    target: { value: credentials.email },
  })
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: credentials.password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('SignInPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('credencial errada mostra o toast em pt-BR e não guarda token', async () => {
    const toastError = vi.spyOn(toast, 'error')

    renderPage([
      {
        request: {
          query: AuthenticateMutation,
          variables: { input: credentials },
        },
        result: {
          errors: [
            new GraphQLError('Invalid credentials', {
              extensions: { code: 'UNAUTHENTICATED' },
            }),
          ],
        },
      },
    ])

    fillAndSubmit()

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('E-mail ou senha incorretos.'),
    )
    expect(getAuthToken()).toBeNull()
  })

  it('credencial certa guarda o token (sem "Lembrar-me": sessionStorage)', async () => {
    renderPage([
      {
        request: {
          query: AuthenticateMutation,
          variables: { input: credentials },
        },
        result: {
          data: {
            authenticate: {
              __typename: 'AuthPayload',
              accessToken: 'jwt-de-teste',
              user: {
                __typename: 'User',
                id: 'user-1',
                name: 'Conta Teste',
                email: credentials.email,
              },
            },
          },
        },
      },
    ])

    fillAndSubmit()

    await waitFor(() => expect(getAuthToken()).toBe('jwt-de-teste'))
    expect(localStorage.length).toBe(0)
  })
})
