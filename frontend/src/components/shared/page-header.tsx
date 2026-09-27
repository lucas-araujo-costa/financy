import type { ReactNode } from 'react'

/** Título (24px bold), subtítulo e a ação principal à direita (Transações e Categorias). */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h1 className="text-2xl leading-8 font-bold text-gray-800">{title}</h1>
        <p className="text-base leading-6 text-gray-600">{description}</p>
      </div>
      {action}
    </header>
  )
}
