import { useQuery } from '@tanstack/react-query'

import { getAllRoles, getModules } from '@/app/actions/rol'

export const useRoles = () => {
  const {
    data: roles = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['role'],
    queryFn: async () => {
      const data = await getAllRoles()
      return data
    },
  })

  return {
    roles,
    isLoading,
    isFetching,
  }
}

export const useModules = () => {
  const {
    data: modules = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['module'],
    queryFn: async () => {
      const data = await getModules()
      return data
    },
  })

  return {
    modules,
    isLoading,
    isFetching,
  }
}
