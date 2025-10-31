import { useQuery } from '@tanstack/react-query'

import { getConfig } from '@/app/actions/configuration'

export const useSetup = () => {
  const {
    data: setup,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['setup'],
    queryFn: async () => {
      const data = await getConfig()
      return data
    },
  })

  return {
    setup,
    isLoading,
    isFetching,
  }
}
