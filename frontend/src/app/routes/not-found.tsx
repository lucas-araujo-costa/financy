import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-800">
        Página não encontrada
      </h1>
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
