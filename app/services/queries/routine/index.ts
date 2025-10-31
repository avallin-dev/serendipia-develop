import { useQuery } from '@tanstack/react-query'

import {
  getAllRoutines,
  getAllRoutinesByPlan,
  getRoutinesByPlanAndWeek,
} from '@/app/actions/routine'

export const useRoutines = () => {
  const {
    data: routines = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['routine'],
    queryFn: async () => {
      const data = await getAllRoutines()
      return data
    },
  })

  return {
    routines,
    isLoading,
    isFetching,
  }
}

export const useRoutinesByPlan = (id: number) => {
  const {
    data: routines = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['routine', id],
    queryFn: async () => {
      const data = await getAllRoutinesByPlan(id)
      return data
    },
  })

  return {
    routines,
    isLoading,
    isFetching,
  }
}

export const useRoutinesByPlanAndWeek = (planId: number, week: number) => {
  const {
    data: routines = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['routine', planId, week],
    queryFn: async () => {
      const data = await getRoutinesByPlanAndWeek(planId, week)
      return data
    },
    enabled: !!planId,
  })

  return {
    routines,
    isLoading,
    isFetching,
  }
}
