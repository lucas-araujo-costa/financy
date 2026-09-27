import { flushSync } from 'react-dom'

/*
 * Troca de estado que muda a tela inteira sem navegação (ex.: login → dashboard
 * na mesma rota "/"). Navegações usam o `viewTransition` do React Router.
 * Sem suporte no navegador, a troca só fica instantânea.
 */
export function withViewTransition(update: () => void) {
  if (!document.startViewTransition) {
    update()
    return
  }

  document.startViewTransition(() => {
    flushSync(update)
  })
}
