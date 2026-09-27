import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react'
import type { ReactNode } from 'react'

import { apolloClient } from '@/services/graphql/apollo-client'

export function ApolloProvider({ children }: { children: ReactNode }) {
  return (
    <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
  )
}
