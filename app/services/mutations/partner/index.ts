import type { socio, sociomembresia } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import {
  createPartner,
  deletePartner,
  updatePartner,
  createPartnerMembership,
  deletePartnerMembership,
  updatePartnerMembership,
  renewPartnerMembership,
  addMember,
  removeMember,
  deletePartnerPic, updateClassAvailable,
} from '@/app/actions/partner'

export function useCreatePartner() {
  return useMutation({
    mutationFn: ({ data, type }: { data: Partial<socio>; type?: 'bloque' | 'grupo' | 'socio' }) =>
      createPartner(data, type),
  })
}

export function useUpdatePartner() {
  return useMutation({
    mutationFn: ({ data, id }: { data: Partial<socio>; id: number }) => updatePartner(id, data),
  })
}

export function useDeletePartner() {
  return useMutation({
    mutationFn: (id: number) => deletePartner(id),
  })
}

export function useCreatePartnerMembership() {
  return useMutation({
    mutationFn: ({ data, id }: { data: Partial<sociomembresia>; id: number }) =>
      createPartnerMembership(id, data),
  })
}

export function useUpdatePartnerMembership() {
  return useMutation({
    mutationFn: ({ data, id }: { data: Partial<sociomembresia>; id: number }) =>
      updatePartnerMembership(id, data),
  })
}

export function useUpdateClassAvailable() {
  return useMutation({
    mutationFn: ({idSocioMembresia}: { idSocioMembresia: number | undefined }) => updateClassAvailable(idSocioMembresia)
  })
}

export function useDeletePartnerMembership() {
  return useMutation({
    mutationFn: (id: number) => deletePartnerMembership(id),
  })
}

export function useRenewPartnerMembership() {
  return useMutation({
    mutationFn: ({ data, id }: { data: Partial<sociomembresia>; id: number }) =>
      renewPartnerMembership(id, data),
  })
}

export function useAddMember() {
  return useMutation({
    mutationFn: ({ data, id }: { data: { idSocio: number }; id: number }) => addMember(id, data),
  })
}

export function useRemoveMember() {
  return useMutation({
    mutationFn: (id: number) => removeMember(id),
  })
}

export function useDeletePartnerPic() {
  return useMutation({
    mutationFn: (id: number) => deletePartnerPic(id),
  })
}
