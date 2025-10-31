import { useQuery } from '@tanstack/react-query'

import {
  getPlansByPartner,
  getAllPlans,
  getPlan,
  getPlanProgress,
  getPlanResume,
} from '@/app/actions/plan'

export const useAllPlans = () => {
  const {
    data: plans = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['plan'],
    queryFn: async () => {
      const data = await getAllPlans()
      return data
    },
  })

  return {
    plans,
    isLoading,
    isFetching,
  }
}

export const usePlansByPartner = (id: number) => {
  const {
    data: plans = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['plan', id.toString()],
    queryFn: async () => {
      const data = await getPlansByPartner(id)
      return data
    },
    enabled: !!id,
  })

  return {
    plans,
    isLoading,
    isFetching,
  }
}

export const useCurrentPlanState = () => {
  const {
    data: plan,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['plan-routine'],
    queryFn: async () => {
      const data = await getPlan()
      return data
    },
  })

  return {
    plan,
    isLoading,
    isFetching,
  }
}

export const usePlanProgress = (idPlan?: number | null) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['plan-progress', idPlan],
    queryFn: async () => {
      const data = await getPlanProgress(idPlan!)
      return data
    },
    enabled: !!idPlan,
  })

  return {
    data,
    isLoading,
    isFetching,
  }
}

export const usePlanResume = (idPlan: number) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['plan-resume', idPlan],
    queryFn: async () => {
      const data = await getPlanResume(idPlan)
      return data
    },
    enabled: !!idPlan,
  })

  return {
    data,
    isLoading,
    isFetching,
  }
}
