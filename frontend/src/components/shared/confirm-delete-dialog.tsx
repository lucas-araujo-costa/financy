import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'

/*
 * Confirmação de exclusão (não está no Figma, docs/decisions.md, ADR-13): mesmo modal dos
 * formulários, com "Cancelar" e "Excluir".
 */

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  isPending?: boolean
  /** false = exclusão bloqueada (ex.: categoria com transações, docs/decisions.md, ADR-12) */
  canConfirm?: boolean
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
  canConfirm = true,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent role="alertdialog">
        <DialogHeader title={title} description={description} wrapDescription />
        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="danger"
            data-autofocus
            isLoading={isPending}
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
