import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getVisiblePages, Pagination } from './pagination'

describe('Pagination', () => {
  it('mostra o intervalo e o total como no Figma', () => {
    render(
      <Pagination page={1} perPage={10} total={27} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole('navigation')).toHaveTextContent(
      '1 a 10 | 27 resultados',
    )
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'Página 3' })).toBeVisible()
  })

  it('desabilita "anterior" na primeira página e "próxima" na última', () => {
    const { rerender } = render(
      <Pagination page={1} perPage={10} total={27} onPageChange={vi.fn()} />,
    )
    expect(
      screen.getByRole('button', { name: 'Página anterior' }),
    ).toBeDisabled()

    rerender(
      <Pagination page={3} perPage={10} total={27} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('navigation')).toHaveTextContent(
      '21 a 27 | 27 resultados',
    )
    expect(
      screen.getByRole('button', { name: 'Próxima página' }),
    ).toBeDisabled()
  })

  it('avisa a página escolhida', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        page={2}
        perPage={10}
        total={27}
        onPageChange={onPageChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Página 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }))

    expect(onPageChange.mock.calls).toEqual([[3], [1]])
  })
})

describe('getVisiblePages', () => {
  it('lista todas até 7 páginas', () => {
    expect(getVisiblePages(1, 3)).toEqual([1, 2, 3])
  })

  it('usa reticências com muitas páginas', () => {
    expect(getVisiblePages(5, 20)).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      20,
    ])
  })
})
