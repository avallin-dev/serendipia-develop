import { useQuery } from '@tanstack/react-query'

import { getVentaCategories } from '@/app/actions/venta_producto'

export const useGetVentaCategories = () => {
  const {
    data: categories = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['venta-categories'],
    queryFn: async () => {
      const data = await getVentaCategories()
      return data
    },
  })
  return { categories, isLoading, isFetching }
}
