import { useQuery } from '@apollo/client/react'

import { GetCategoriesQuery } from '../services/get-categories'

export function useCategories() {
  const { data, loading, error, refetch } = useQuery(GetCategoriesQuery)

  return {
    categories: data?.categories,
    isLoading: loading && !data,
    error: data ? undefined : error,
    refetch,
  }
}
