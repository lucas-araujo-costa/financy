import { ReceiptTextIcon } from 'lucide-react'

import { EmptyState } from '@/components/shared/empty-state'
import { QueryErrorState } from '@/components/shared/query-error-state'
import { Pagination } from '@/components/shared/pagination'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import type { TransactionListItem } from '../types'
import { TransactionTableRow } from './transaction-table-row'
import { TransactionsTableSkeleton } from './transactions-table-skeleton'

interface TransactionsTableProps {
  transactions: TransactionListItem[]
  total: number
  page: number
  perPage: number
  onPageChange: (page: number) => void
  onEdit: (transaction: TransactionListItem) => void
  onDelete: (transaction: TransactionListItem) => void
  /** Primeira carga: skeleton no lugar das linhas */
  isLoading?: boolean
  /** Refetch/paginação/filtro: dados anteriores com opacidade reduzida (AGENTS.md › Movimento) */
  isStale?: boolean
  removingId?: string | null
  /** Falha na primeira carga: mensagem e "Tentar novamente" */
  error?: unknown
  onRetry?: () => void
}

export function TransactionsTable({
  transactions,
  total,
  page,
  perPage,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
  isStale = false,
  removingId = null,
  error,
  onRetry,
}: TransactionsTableProps) {
  const hasError = Boolean(error) && !isLoading
  const isEmpty = !isLoading && !hasError && transactions.length === 0

  return (
    <Card aria-busy={isLoading || isStale} className="overflow-hidden">
      <div
        className={cn(
          'transition-opacity duration-base ease-out',
          isStale && 'opacity-60',
        )}
      >
        <Table className="min-w-[960px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-28 text-center">Data</TableHead>
              <TableHead className="w-50 text-center">Categoria</TableHead>
              <TableHead className="w-34 text-center">Tipo</TableHead>
              <TableHead className="w-50 text-right">Valor</TableHead>
              <TableHead className="w-30 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          {!isEmpty && !hasError && (
            <TableBody>
              {isLoading ? (
                <TransactionsTableSkeleton rows={perPage} />
              ) : (
                transactions.map((transaction) => (
                  <TransactionTableRow
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isRemoving={transaction.id === removingId}
                  />
                ))
              )}
            </TableBody>
          )}
        </Table>

        {hasError && (
          <QueryErrorState
            error={error}
            onRetry={() => onRetry?.()}
            className="border-b border-gray-200"
          />
        )}

        {isEmpty && (
          <EmptyState
            icon={ReceiptTextIcon}
            title="Nenhuma transação encontrada"
            description="Ajuste os filtros ou registre uma nova transação."
            className="border-b border-gray-200"
          />
        )}
      </div>

      {!isLoading && !hasError && total > 0 && (
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  )
}
