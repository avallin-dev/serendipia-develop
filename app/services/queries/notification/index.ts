import { useQuery } from '@tanstack/react-query'

import { getAllNotification } from '@/app/actions/notification/index'

export const useNotification = () => {
  const {
    data: notifications = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['notification'],
    queryFn: async () => {
      const data = await getAllNotification()
      return data
    },
  })

  return {
    notifications,
    isLoading,
    isFetching,
  }
}
