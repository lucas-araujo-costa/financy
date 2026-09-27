import { act, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TransactionTableFilters } from './transaction-table-filters'

function renderAt(url: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/transacoes',
        element: (
          <TransactionTableFilters
            categories={[{ id: 'cat-1', title: 'Alimentação' }]}
          />
        ),
      },
    ],
    { initialEntries: [url] },
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('TransactionTableFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('lê os filtros da URL', () => {
    renderAt('/transacoes?search=mercado&type=EXPENSE&categoryId=cat-1')

    expect(screen.getByLabelText('Buscar')).toHaveValue('mercado')
    expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveTextContent(
      'Saída',
    )
    expect(
      screen.getByRole('combobox', { name: 'Categoria' }),
    ).toHaveTextContent('Alimentação')
  })

  it('escreve a busca na URL depois do debounce e volta para a página 1', () => {
    const router = renderAt('/transacoes?page=3')

    fireEvent.change(screen.getByLabelText('Buscar'), {
      target: { value: 'jantar' },
    })
    expect(router.state.location.search).toBe('?page=3')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(router.state.location.search).toBe('?search=jantar')
  })

  it('sem período na URL mostra o mês atual', () => {
    renderAt('/transacoes')

    const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
      new Date(),
    )
    expect(screen.getByRole('combobox', { name: 'Período' })).toHaveTextContent(
      new RegExp(`${month} / ${new Date().getFullYear()}`, 'i'),
    )
  })
})
