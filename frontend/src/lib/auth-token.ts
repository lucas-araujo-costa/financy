/*
 * "Lembrar-me" marcado → localStorage (sobrevive ao fechar o navegador).
 * Desmarcado → sessionStorage (some ao fechar a aba).
 *
 * Quem precisa reagir à entrada ou saída do token (layouts, rota "/") assina
 * com `subscribeAuthToken`, o que permite usar `useSyncExternalStore`.
 */

const TOKEN_KEY = 'financy:access-token'

type Listener = () => void

const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string, remember: boolean) {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)

  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
  notify()
}

export function clearAuthToken() {
  const hadToken = getAuthToken() !== null

  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  if (hadToken) notify()
}

export function subscribeAuthToken(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
