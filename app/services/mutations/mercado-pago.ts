import { useMutation } from '@tanstack/react-query'

import { createMercadoPagoPreference } from '@/app/actions/pay-method'

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
