import { useMutation } from '@tanstack/react-query'

import inSitePayments, {createMercadoPagoPreference} from '@/app/actions/pay-method'
import {inSitePaymentType} from "@/app/schemas/in-site-payment/inSitePayment";

interface MercadoPagoPreferenceInput {
  idSocio: number
  idSocioMembresia: number
  nombreMembresia: string
  monto: number
  socioNombre: string
  socioEmail: string
}

export function useMercadoPagoPreferenceMutation() {
  return useMutation({
    mutationFn: (data: MercadoPagoPreferenceInput) => createMercadoPagoPreference(data),
  })
}

export function useInSitePayment(values: inSitePaymentType){
    return inSitePayments(values)
}
