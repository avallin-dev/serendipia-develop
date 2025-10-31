import { useQuery } from '@tanstack/react-query'

import { getMessages, getSociosWithChats } from '@/app/actions/bot'

export const useGetMessages = (socioId?: number) => {
  const {
    data: messages = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['messages', socioId],
    queryFn: async () => {
      const data = await getMessages(socioId!)
      return data
    },
    enabled: !!socioId,
  })

  return {
    messages,
    isLoading,
    isFetching,
  }
}

export const useGetSociosWithChats = () => {
  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['socios-with-chats'],
    queryFn: async () => {
      const data = await getSociosWithChats()
      return data
    },
  })
  return { socios: data, isLoading, isFetching }
}
