import { Toaster as Sonner } from 'sonner'

/** Toasts no estilo dos cards do Figma. A animação de entrada e saída é a do sonner. */
export function Toaster() {
  return (
    <Sonner
      // Embaixo: no topo direito o toast cobria o avatar "Meu perfil" (docs/decisions.md, ADR-13)
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'font-sans !rounded-xl !border !border-gray-200 !bg-white !text-gray-800 !shadow-[0_4px_7.5px_rgba(0,0,0,0.1)]',
          title: '!text-sm !font-medium',
          description: '!text-sm !text-gray-600',
          success: '[&_[data-icon]]:!text-success',
          error: '[&_[data-icon]]:!text-danger',
          closeButton:
            '!border-gray-200 !bg-white !text-gray-700 hover:!bg-gray-200',
        },
      }}
    />
  )
}
