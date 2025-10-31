'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeletePartner } from '@/app/services/mutations/partner'

type ModalDeletePartnerProps = {
  id?: number
  onClose: () => void
  open: boolean
  type: 'bloque' | 'grupo' | 'socio'
}

export function DeletePartner({ id, onClose, open, type }: ModalDeletePartnerProps) {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const router = useRouter()
  const deletePartnerMutation = useDeletePartner()

  async function onDelete() {
    deletePartnerMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['partnerType', type],
        })
        toast.success('Eliminado correctamente')
        router.push(pathname!)
        onClose()
      },
      onError(error) {
        console.error(error)
        toast.error('Error inesperado. Intente mas tarde')
      },
    })
  }

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`Quieres eliminar al socio ${type}`}
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deletePartnerMutation.isPending}
      isLoading={deletePartnerMutation.isPending}
    />
  )
}
