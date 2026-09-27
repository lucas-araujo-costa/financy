import { toast } from 'sonner'

import { type ApiErrorCode, toApiError } from './api-error'

interface RunMutationOptions {
  /** Toast de sucesso (architecture.md › fluxo de ponta a ponta) */
  success?: string
  /** Mensagens da tela por código de erro; o resto usa a mensagem padrão */
  errors?: Partial<Record<ApiErrorCode, string>>
}

/**
 * Executa a mutation e mostra o toast de sucesso ou de erro em pt-BR.
 * Devolve `true` se deu certo, para a tela fechar o dialog.
 */
export async function runMutation(
  mutation: () => Promise<unknown>,
  { success, errors }: RunMutationOptions = {},
) {
  try {
    await mutation()
    if (success) toast.success(success)
    return true
  } catch (error) {
    toast.error(toApiError(error, errors).message)
    return false
  }
}
