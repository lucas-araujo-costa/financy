import type { ReactNode } from 'react'
import { Outlet } from 'react-router'

import { Logo } from '@/components/shared/logo'

/**
 * Telas deslogadas (Figma "Login" e "Cadastro"): logo centralizado e o card
 * da página 32px abaixo. Na rota "/" recebe a página por children.
 */
export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-8 px-4 py-12 sm:px-12">
      <Logo />
      <main className="w-full max-w-[448px]">{children ?? <Outlet />}</main>
    </div>
  )
}
