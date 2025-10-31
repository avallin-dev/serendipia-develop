import { useQuery } from '@tanstack/react-query'

import {
  getPilates,
  getPilatesByPartner,
  getPilatesRecover,
  getPilatesAvailable,
  getPartnerMembershipWithPilates,
} from '@/app/actions/pilate'

export const usePilates = (startDate?: Date, endDate?: Date) => {
  const {
    data: pilates = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pilate', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const data = await getPilates(startDate, endDate)
      return data
    },
    enabled: !!startDate && !!endDate,
  })

  return {
    pilates,
    isLoading,
    isFetching,
  }
}

export const usePilatesByPartner = (id?: number) => {
  const {
    data: pilates = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pilate-partner'],
    queryFn: async () => {
      const data = await getPilatesByPartner()
      return data
    },
    enabled: !!id,
  })

  return {
    pilates,
    isLoading,
    isFetching,
  }
}

export const usePilatesRecover = () => {
  const {
    data: pilatesRecover = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pilate-recover'],
    queryFn: async () => {
      const data = await getPilatesRecover()
      return data
    },
  })

  return {
    pilatesRecover,
    isLoading,
    isFetching,
  }
}

export const usePilatesAvailable = (date: Date) => {
  const {
    data: availableList = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pilate-available'],
    queryFn: async () => {
      const data = await getPilatesAvailable(date)
      return data
    },
    enabled: !!date,
  })

  return {
    availableList,
    isLoading,
    isFetching,
  }
}

export const usePartnerMembershipWithPilates = (id?: number | null) => {
  const {
    data: partnerMembership = null,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pilate-partner-membership'],
    queryFn: async () => {
      const data = await getPartnerMembershipWithPilates(id)
      return data
    },
    enabled: !!id,
  })

  return {
    partnerMembership,
    isLoading,
    isFetching,
  }
}
