'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteMembership } from '@/app/services/mutations/membership'

type ModalDeleteSampleProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function ModalDeleteSample({ id, onClose, open }: ModalDeleteSampleProps) {
  const queryClient = useQueryClient()
  const deleteMembershipMutation = useDeleteMembership()

  async function onDelete() {
    deleteMembershipMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['membership'],
        })
        toast.success('Membresía eliminada exitosamente')
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
      title="¿Quieres eliminar esta membresía?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteMembershipMutation.isPending}
      isLoading={deleteMembershipMutation.isPending}
    />
  )
}
