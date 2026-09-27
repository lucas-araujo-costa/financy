import { RotateCwIcon, TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toApiError } from '@/services/graphql/api-error'

import { EmptyState } from './empty-state'

/** Falha ao carregar dados (não está no Figma): mensagem e "Tentar novamente". */
export function QueryErrorState({
  error,
  onRetry,
  className,
}: {
  error: unknown
  onRetry: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={TriangleAlertIcon}
      title="Não foi possível carregar"
      description={toApiError(error).message}
      className={className}
      action={
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RotateCwIcon aria-hidden />
          Tentar novamente
        </Button>
      }
    />
  )
}
