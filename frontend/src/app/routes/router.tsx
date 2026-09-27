import { createBrowserRouter } from 'react-router'

import { SignUpPage } from '@/features/auth'
import { CategoriesPage } from '@/features/categories'
import { ProfilePage } from '@/features/profile'
import { TransactionsPage } from '@/features/transactions'

import { ErrorBoundary } from './error-boundary'
import { HomeRoute } from './home-route'
import { AppLayout } from './layouts/app-layout'
import { AuthLayout } from './layouts/auth-layout'
import { NotFound } from './not-found'

// Modo biblioteca do React Router (createBrowserRouter), nunca o framework mode
export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <HomeRoute /> },
      {
        element: <AuthLayout />,
        children: [{ path: '/cadastro', element: <SignUpPage /> }],
      },
      {
        element: <AppLayout />,
        children: [
          { path: '/transacoes', element: <TransactionsPage /> },
          { path: '/categorias', element: <CategoriesPage /> },
          { path: '/perfil', element: <ProfilePage /> },
        ],
      },
      // Vitrine dos componentes de ui/ para comparar com o Style Guide (só em dev)
      ...(import.meta.env.DEV
        ? [
            {
              path: '/_dev/ui',
              lazy: async () => {
                const { UiPreview } = await import('./dev/ui-preview')
                return { Component: UiPreview }
              },
            },
            {
              path: '/_dev/screens',
              lazy: async () => {
                const { ScreensPreview } = await import('./dev/screens-preview')
                return { Component: ScreensPreview }
              },
            },
          ]
        : []),
      { path: '*', element: <NotFound /> },
    ],
  },
])
