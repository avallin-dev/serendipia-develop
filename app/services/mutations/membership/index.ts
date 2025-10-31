import { useMutation } from '@tanstack/react-query'

import {
  createMembership,
  updateMembership,
  deleteMembership,
  payMembership,
  updatePayMembership,
} from '@/app/actions/membership'
import { membershipSchmaType } from '@/app/schemas/membership'

export function useCreateMembership() {
  return useMutation({
    mutationFn: ({ data }: { data: membershipSchmaType }) => createMembership(data),
  })
}

export function useUpdateMembership() {
  return useMutation({
    mutationFn: ({ data, id }: { data: membershipSchmaType; id: number }) =>
      updateMembership(id, data),
  })
}

export function useDeleteMembership() {
  return useMutation({
    mutationFn: (id: number) => deleteMembership(id),
  })
}

type usePayMembershipDataType = {
  importe: number
  observacion?: string
  idSocioMembresia: number
}
export function useCreatePayMembership() {
  return useMutation({
    mutationFn: ({ data, id }: { data: usePayMembershipDataType; id: number }) =>
      payMembership(id, data),
  })
}

export function useUpdatePayMembership() {
  return useMutation({
    mutationFn: ({
      data,
      idSocioMembresia,
    }: {
      data: usePayMembershipDataType
      idSocioMembresia: number
    }) => updatePayMembership(idSocioMembresia, data),
  })
}
