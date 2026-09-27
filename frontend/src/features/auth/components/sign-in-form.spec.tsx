import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { SignInForm } from './sign-in-form'

function renderForm(onSubmit = vi.fn()) {
  const router = createMemoryRouter([
    { path: '/', element: <SignInForm onSubmit={onSubmit} /> },
  ])
  render(<RouterProvider router={router} />)
  return { onSubmit }
}

describe('SignInForm', () => {
  it('mostra os erros de validação e não envia com campos vazios', async () => {
    const { onSubmit } = renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Informe um e-mail válido')).toBeVisible()
    expect(screen.getByText('Informe sua senha')).toBeVisible()
    expect(screen.getByLabelText('E-mail')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia e-mail, senha e "Lembrar-me"', async () => {
    const { onSubmit } = renderForm()

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'conta@teste.com' },
    })
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: '12345678' },
    })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual({
      email: 'conta@teste.com',
      password: '12345678',
      remember: true,
    })
  })

  it('mostra e oculta a senha', () => {
    renderForm()
    const password = screen.getByLabelText('Senha')

    expect(password).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(password).toHaveAttribute('type', 'text')
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(password).toHaveAttribute('type', 'password')
  })
})
