import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { IconButton } from './icon-button'

/*
 * Modal do Figma: overlay preto 20%, card de 448px com raio 12 e padding 24.
 * Overlay com fade; conteúdo com fade + zoom 95% → 100% na entrada e o
 * inverso, mais curto, na saída (AGENTS.md › Movimento).
 */

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

/*
 * Ao abrir, foca o primeiro campo do formulário em vez do botão de fechar
 * (o primeiro focável no DOM). Sem campo, foca o próprio conteúdo.
 */
function focusFirstField(event: Event) {
  event.preventDefault()
  const content = event.currentTarget as HTMLElement
  const field = content.querySelector<HTMLElement>(
    'input:not([disabled]), textarea:not([disabled]), [data-autofocus]',
  )
  ;(field ?? content).focus()
}

function DialogContent({
  className,
  children,
  onOpenAutoFocus = focusFirstField,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
          'fixed inset-0 z-50 bg-black/20',
          'data-[state=open]:animate-in data-[state=open]:duration-base data-[state=open]:ease-out data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:duration-fast data-[state=closed]:ease-in data-[state=closed]:fade-out-0',
        )}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        tabIndex={-1}
        onOpenAutoFocus={onOpenAutoFocus}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[448px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 outline-none',
          'data-[state=open]:animate-in data-[state=open]:duration-base data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:duration-fast data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

/** Título + descrição à esquerda e o botão de fechar (IconButton com X) à direita */
function DialogHeader({
  title,
  description,
  wrapDescription = false,
}: {
  title: string
  description?: string
  /** O subtítulo do Figma é de uma linha; mensagens longas (confirmação) quebram */
  wrapDescription?: boolean
}) {
  return (
    <div data-slot="dialog-header" className="flex items-start gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <DialogPrimitive.Title className="text-base leading-6 font-semibold text-gray-800">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description
            className={cn(
              'text-sm leading-5 text-gray-600',
              !wrapDescription && 'truncate',
            )}
          >
            {description}
          </DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">
            {title}
          </DialogPrimitive.Description>
        )}
      </div>
      <DialogPrimitive.Close asChild>
        <IconButton aria-label="Fechar">
          <XIcon />
        </IconButton>
      </DialogPrimitive.Close>
    </div>
  )
}

export { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger }
