import { useQuery } from '@tanstack/react-query'

import {
    getAllMemberships,
    getMembership,
    getMembershipPayments,
    getPartnerMembership,
    getPayMembership,
    getAllSociomemberships, getAllSociomembershipsActive,
} from '@/app/actions/membership'
import {
  updateMercadoPagoPaymentStatus,
  validateMercadoPagoSubscription,
} from '@/app/actions/pay-method'

export const useAllMemberships = () => {
  const {
    data: memberships,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['membership'],
    queryFn: async () => {
      const data = await getAllMemberships()
      return data
    },
  })

  return {
    memberships,
    isLoading,
    isFetching,
  }
}

export const useMembership = (id: string) => {
  const {
    data: membership,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['membership', id],
    queryFn: async () => {
      const data = await getMembership(parseInt(id))
      return data
    },
  })

  return {
    membership,
    isLoading,
    isFetching,
  }
}

export const usePartnerMembership = (id: string) => {
  const {
    data: partnerMembership,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner-membership', id],
    queryFn: async () => {
      const data = await getPartnerMembership(parseInt(id))
      return data
    },
  })

  return {
    partnerMembership,
    isLoading,
    isFetching,
  }
}

export const usePayMembership = (id: string) => {
  const {
    data: payMembership,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner-membership', id],
    queryFn: async () => {
      const data = await getPayMembership(parseInt(id))
      return data
    },
    enabled: !!id,
  })

  return {
    payMembership,
    isLoading,
    isFetching,
  }
}

export const useMembershipPayments = (idSocio?: number) => {
  const {
    data: memberships = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['partner-membership-payments', idSocio],
    queryFn: async () => {
      const data = await getMembershipPayments(idSocio!)
      return data
    },
    enabled: !!idSocio,
  })

  return {
    memberships,
    isLoading,
    isFetching,
  }
}

export const useAllSociomemberships = () => {
  const {
    data: sociomemberships,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['all-sociomemberships'],
    queryFn: async () => {
      const data = await getAllSociomemberships()
      return data
    },
  })

  return {
    sociomemberships,
    isLoading,
    isFetching,
  }
}

export const useAllSociomembershipsActive = () => {
    const {
        data: sociomemberships = [],
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['all-sociomemberships'],
        queryFn: async () => {
            const data = await getAllSociomembershipsActive()
            return data
        },
    })

    return {
        sociomemberships,
        isLoading,
        isFetching,
    }
}

interface Params {
  payment_id?: string
  preference_id?: string
}

export function useUpdateMercadoPagoPaymentStatusQuery({ payment_id, preference_id }: Params) {
  return useQuery({
    queryKey: ['mercadopago-payment-status', payment_id, preference_id],
    queryFn: async () => {
      if (!payment_id || !preference_id) throw new Error('Faltan parámetros')
      return await updateMercadoPagoPaymentStatus({ payment_id, preference_id })
    },
    enabled: !!payment_id && !!preference_id,
    retry: false,
  })
}

interface SubscriptionParams {
  preapproval_id?: string
  status?: string
}

export function useValidateMercadoPagoSubscriptionQuery({
  preapproval_id,
  status,
}: SubscriptionParams) {
  return useQuery({
    queryKey: ['mercadopago-subscription-status', preapproval_id, status],
    queryFn: async () => {
      if (!preapproval_id) throw new Error('Falta preapproval_id')
      return await validateMercadoPagoSubscription({ preapproval_id, status })
    },
    enabled: !!preapproval_id,
    retry: false,
  })
}
