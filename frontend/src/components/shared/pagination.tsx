import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { PaginationButton } from '@/components/ui/pagination-button'

/*
 * Rodapé da tabela do Figma: "1 a 10 | 27 resultados" à esquerda e
 * anterior / páginas / próxima à direita.
 */

interface PaginationProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

/** Páginas visíveis: todas até 7; acima disso, as pontas e a vizinhança da atual. */
export function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  sorted.forEach((item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) result.push('ellipsis')
    result.push(item)
  })
  return result
}

export function Pagination({
  page,
  perPage,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const first = total === 0 ? 0 : (page - 1) * perPage + 1
  const last = Math.min(page * perPage, total)

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
    >
      <p className="text-sm leading-5 text-gray-700">
        <span className="font-medium">{first}</span> a{' '}
        <span className="font-medium">{last}</span> |{' '}
        <span className="font-medium">{total}</span> resultados
      </p>

      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </IconButton>

        {getVisiblePages(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden
              className="w-8 text-center text-sm text-gray-500"
            >
              …
            </span>
          ) : (
            <PaginationButton
              key={item}
              isActive={item === page}
              aria-label={`Página ${item}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PaginationButton>
          ),
        )}

        <IconButton
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </nav>
  )
}
