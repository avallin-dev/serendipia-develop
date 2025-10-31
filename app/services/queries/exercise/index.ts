import { useQuery } from '@tanstack/react-query'

import { getAllExercises } from '@/app/actions/exercise'

export const useExercises = () => {
  const {
    data: exercises = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['exercise'],
    queryFn: async () => {
      const data = await getAllExercises()
      return data
    },
  })

  return {
    exercises,
    isLoading,
    isFetching,
  }
}
