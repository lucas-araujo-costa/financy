import { CombinedGraphQLErrors } from '@apollo/client/errors'

/*
 * Normaliza qualquer erro do Apollo em { code, message } para a UI.
 * Os códigos vêm de `extensions.code` do backend (docs/api-contract.md › Erros).
 */

export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_USER_INPUT'
  | 'CONFLICT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'

export interface ApiError {
  code: ApiErrorCode
  message: string
}

const knownCodes: ApiErrorCode[] = [
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'BAD_USER_INPUT',
  'CONFLICT',
]

const defaultMessages: Record<ApiErrorCode, string> = {
  UNAUTHENTICATED: 'Sua sessão expirou. Entre novamente.',
  FORBIDDEN: 'Você não tem permissão para fazer isso.',
  NOT_FOUND: 'O registro não foi encontrado.',
  BAD_USER_INPUT: 'Confira os dados informados.',
  CONFLICT: 'Esse registro já existe.',
  NETWORK_ERROR: 'Não foi possível conectar ao servidor.',
  UNKNOWN: 'Algo deu errado. Tente novamente.',
}

export function getErrorCode(error: unknown): ApiErrorCode {
  if (CombinedGraphQLErrors.is(error)) {
    const code = error.errors[0]?.extensions?.code
    return knownCodes.find((known) => known === code) ?? 'UNKNOWN'
  }

  return error ? 'NETWORK_ERROR' : 'UNKNOWN'
}

/**
 * @param messages mensagens específicas da tela por código
 * (ex.: CONFLICT no cadastro → "Este e-mail já está cadastrado.")
 */
export function toApiError(
  error: unknown,
  messages: Partial<Record<ApiErrorCode, string>> = {},
): ApiError {
  const code = getErrorCode(error)
  return { code, message: messages[code] ?? defaultMessages[code] }
}
