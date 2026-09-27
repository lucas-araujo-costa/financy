import { SignInPage, useAuthToken } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'

import { AppLayout } from './layouts/app-layout'
import { AuthLayout } from './layouts/auth-layout'

/** "/" mostra o login para quem está deslogado e o dashboard para quem está logado. */
export function HomeRoute() {
  const token = useAuthToken()

  if (!token) {
    return (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    )
  }

  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  )
}
