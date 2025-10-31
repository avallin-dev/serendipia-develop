import { useQuery } from '@tanstack/react-query'

import { getAllCategories } from '@/app/actions/category'

export const useCategory = () => {
  const {
    data: categories = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const data = await getAllCategories()
      return data
    },
  })

  return {
    categories,
    isLoading,
    isFetching,
  }
}
