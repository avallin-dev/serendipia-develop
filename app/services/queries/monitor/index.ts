import { useQuery } from '@tanstack/react-query'

import { getMonitor, getMonitorByPartner } from '@/app/actions/monitor'

export const useMonitor = () => {
  const {
    data: data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['monitor'],
    queryFn: async () => {
      const data = await getMonitor()
      return data
    },
    refetchInterval: 60000,
  })

  return {
    data,
    isLoading,
    isFetching,
  }
}

export const useMonitorByPartner = (idSocio?: number) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['monitor', idSocio],
    queryFn: async () => {
      const data = await getMonitorByPartner(idSocio!)
      return data
    },
    enabled: !!idSocio,
  })

  return {
    data,
    isLoading,
    isFetching,
  }
}
