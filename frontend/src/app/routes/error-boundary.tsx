import { Link, useRouteError } from 'react-router'

export function ErrorBoundary() {
  const error = useRouteError()

  if (import.meta.env.DEV) console.error(error)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Algo deu errado</h1>
      <p className="text-sm text-gray-600">
        Tente recarregar a página. Se o problema continuar, volte mais tarde.
      </p>
      <Link
        to="/"
        viewTransition
        className="text-sm font-medium text-brand-base underline-offset-4 transition-colors duration-fast hover:text-brand-dark hover:underline"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
