import { useQuery } from '@tanstack/react-query'

import { getAllUsers, getUserModules, getAllUsersEvenSuperAdmin } from '@/app/actions/user'

export const useUserModule = () => {
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user-modules'],
    queryFn: async () => {
      const data = await getUserModules()
      return data
    },
  })

  return {
    user,
    isLoading,
    isFetching,
  }
}

export const useAllUsers = () => {
  const {
    data: users = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await getAllUsers()
      return data
    },
  })

  return {
    users,
    isLoading,
    isFetching,
  }
}

export const useAllUsersEvenSuperAdmin = () => {
  const {
    data: users = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['user-even-super-admin'],
    queryFn: async () => {
      const data = await getAllUsersEvenSuperAdmin()
      return data
    },
  })

  return {
    users,
    isLoading,
    isFetching,
  }
}
