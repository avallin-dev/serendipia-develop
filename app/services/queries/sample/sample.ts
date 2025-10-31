import { useQuery } from '@tanstack/react-query'

import { getPartnerSamples } from '@/app/actions/preview'

export const useSamples = (id: string) => {
  const {
    data: samples = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['samples', id],
    queryFn: async () => {
      const data = await getPartnerSamples(parseInt(id!))
      return data
    },
  })

  return {
    samples,
    isLoading,
    isFetching,
  }
}
