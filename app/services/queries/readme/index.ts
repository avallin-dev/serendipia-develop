import { useQuery } from '@tanstack/react-query'

import { getAllReadme } from '@/app/actions/readme'

export const useReadme = () => {
  const {
    data: readme = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['readme'],
    queryFn: async () => {
      const data = await getAllReadme()
      return data
    },
  })

  return {
    readme,
    isLoading,
    isFetching,
  }
}
