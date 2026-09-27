import type { LucideIcon } from 'lucide-react'

import { Card, CardLabel } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Card do topo do dashboard: ícone de 20px + legenda em caixa alta + valor de 28px. */
export function SummaryCard({
  icon: Icon,
  iconClassName,
  label,
  amountInCents,
  isLoading = false,
}: {
  icon: LucideIcon
  iconClassName: string
  label: string
  amountInCents?: number
  isLoading?: boolean
}) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Icon aria-hidden className={cn('size-5', iconClassName)} />
        <CardLabel>{label}</CardLabel>
      </div>
      {isLoading || amountInCents === undefined ? (
        <Skeleton className="h-8 w-44" />
      ) : (
        <p className="animate-in text-[28px] leading-8 font-bold text-gray-800 duration-slow ease-out fade-in-0">
          {formatCurrency(amountInCents)}
        </p>
      )}
    </Card>
  )
}
