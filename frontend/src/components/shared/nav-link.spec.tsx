import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { NavLink } from './nav-link'

function renderAt(path: string) {
  const nav = (
    <nav>
      <NavLink to="/" end>
        Dashboard
      </NavLink>
      <NavLink to="/transacoes">Transações</NavLink>
    </nav>
  )
  const router = createMemoryRouter(
    [
      { path: '/', element: nav },
      { path: '/transacoes', element: nav },
    ],
    { initialEntries: [path] },
  )
  render(<RouterProvider router={router} />)
}

describe('NavLink', () => {
  it('marca só o item da rota atual como ativo', () => {
    renderAt('/transacoes')

    const active = screen.getByRole('link', { name: 'Transações' })
    const inactive = screen.getByRole('link', { name: 'Dashboard' })

    expect(active).toHaveAttribute('aria-current', 'page')
    expect(active).toHaveClass('text-brand-base')
    expect(inactive).not.toHaveAttribute('aria-current')
    expect(inactive).toHaveClass('text-gray-600')
  })

  it('"Dashboard" (rota "/") não fica ativo nas outras rotas', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
