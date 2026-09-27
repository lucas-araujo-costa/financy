import { RouterProvider } from 'react-router/dom'

import { ApolloProvider } from './providers/apollo-provider'
import { Toaster } from './providers/toaster'
import { router } from './routes/router'

export function App() {
  return (
    <ApolloProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ApolloProvider>
  )
}
