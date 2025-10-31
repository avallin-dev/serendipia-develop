import { useQuery } from '@tanstack/react-query'

import {
  getAllPartners,
  getFullPartnerById,
  getMembershipsByPartner,
  getMembershipsWithPilates,
  getPartners,
  getPartnersByType,
} from '@/app/actions/partner'

export const usePartner = (id: string) => {
  const {
    data: partner,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner', id],
    queryFn: async () => {
      if (id) {
        const data = await getFullPartnerById(parseInt(id))
        return data
      } else return undefined
    },
    enabled: !!id,
  })

  return {
    partner,
    isLoading,
    isFetching,
  }
}

export const usePartners = () => {
  const {
    data: partners = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const data = await getAllPartners()
      return data
    },
  })

  return {
    partners,
    isLoading,
    isFetching,
  }
}

export const usePartnersBoards = () => {
  const {
    data: partners = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partnerboards'],
    queryFn: async () => {
      const data = await getPartners()
      return data
    },
  })

  return {
    partners,
    isLoading,
    isFetching,
  }
}

export const usePartnersByType = (type: string) => {
  const {
    data: partners = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partnerType', type],
    queryFn: async () => {
      const data = await getPartnersByType(type)
      return data
    },
  })

  return {
    partners,
    isLoading,
    isFetching,
  }
}

export const usePartnerMemberships = (id: string) => {
  const {
    data: partnerMemberships = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner-membership', id],
    queryFn: async () => {
      if (id) {
        const data = await getMembershipsByPartner(parseInt(id))
        return data
      } else return undefined
    },
    enabled: !!id,
  })

  return {
    partnerMemberships,
    isLoading,
    isFetching,
  }
}

export const usePartnerWithPilates = () => {
  const {
    data: partners = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner-pilates'],
    queryFn: async () => {
      const data = await getMembershipsWithPilates()
      return data
    },
  })

  return {
    partners,
    isLoading,
    isFetching,
  }
}
