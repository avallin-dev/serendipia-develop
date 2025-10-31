import { useQuery } from '@tanstack/react-query'

import { getSociosConPlan } from '@/app/actions/seguimiento_planes'

export const useSociosConPlan = () => {
  const {
    data: sociosConPlan = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['seguimiento_planes'],
    queryFn: async () => {
      const data = await getSociosConPlan()
      return data
    },
  })

  return {
    sociosConPlan,
    isLoading,
    isFetching,
  }
}
