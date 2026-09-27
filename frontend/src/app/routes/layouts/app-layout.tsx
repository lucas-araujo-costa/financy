import { type ReactNode, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { Header } from '@/components/shared/header'
import { useAuthToken, useSession } from '@/features/auth'

/** Telas logadas: header fixo + miolo. Sem token, volta para "/". */
export function AppLayout({ children }: { children?: ReactNode }) {
  const token = useAuthToken()
  const { user } = useSession()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    // Em "/" a HomeRoute já troca para o login. Nas outras rotas, o conteúdo
    // atual fica na tela até o crossfade para "/", sem piscar em branco.
    if (!token && pathname !== '/') {
      navigate('/', { replace: true, viewTransition: true })
    }
  }, [token, pathname, navigate])

  return (
    <div className="min-h-dvh">
      <Header userName={user?.name} />
      <main className="px-4 py-8 sm:p-12">
        <div className="mx-auto w-full max-w-[1280px]">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  )
}
