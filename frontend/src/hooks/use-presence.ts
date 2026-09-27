import { useEffect, useState } from 'react'

/*
 * Mantém um valor montado por `exitMs` depois de ele virar vazio, para a saída
 * animar antes de desmontar (ex.: mensagem de erro do campo).
 */
export function usePresence<T>(value: T | null | undefined, exitMs: number) {
  const [rendered, setRendered] = useState(value ?? null)
  const isPresent = value !== null && value !== undefined && value !== ''

  if (isPresent && rendered !== value) {
    setRendered(value)
  }

  useEffect(() => {
    if (isPresent) return
    const timeout = setTimeout(() => setRendered(null), exitMs)
    return () => clearTimeout(timeout)
  }, [isPresent, exitMs])

  return {
    value: isPresent ? value : rendered,
    state: isPresent ? ('open' as const) : ('closed' as const),
  }
}
