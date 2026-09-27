import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'

/** Card das telas de login e cadastro: 448px, título e subtítulo centralizados. */
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card className="flex animate-in flex-col gap-8 p-8 duration-slow ease-out fade-in-0">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl leading-7 font-bold text-gray-800">{title}</h1>
        <p className="text-base leading-6 text-gray-600">{description}</p>
      </header>
      {children}
    </Card>
  )
}
