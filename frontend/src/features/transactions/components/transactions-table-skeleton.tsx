import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

/** Linhas com o mesmo formato das reais (72px, mesmas colunas). */
export function TransactionsTableSkeleton({ rows = 10 }: { rows?: number }) {
  return Array.from({ length: rows }, (_, index) => (
    <TableRow key={index} aria-hidden>
      <TableCell>
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-5 w-48" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="mx-auto h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="mx-auto h-7 w-24 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="mx-auto h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="ml-auto h-5 w-24" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  ))
}
