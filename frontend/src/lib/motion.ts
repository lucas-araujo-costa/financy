/** Mesmo valor de --duration-base (global.css): saída de item excluído */
export const EXIT_DURATION_MS = 200

/** Espera a animação de saída terminar antes de a lista ser reorganizada (AGENTS.md › Movimento) */
export function waitForExit() {
  return new Promise<void>((resolve) => setTimeout(resolve, EXIT_DURATION_MS))
}
