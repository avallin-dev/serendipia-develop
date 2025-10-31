'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteUser } from '@/app/services/mutations/user'

type ModalDeleteUserProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteUser({ id, onClose, open }: ModalDeleteUserProps) {
  const queryClient = useQueryClient()
  const deleteUserMutation = useDeleteUser()

  async function onDelete() {
    deleteUserMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['user'],
        })
        toast.success('Usuario eliminado exitosamente')
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
      title="¿Quieres eliminar este usuario?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteUserMutation.isPending}
      isLoading={deleteUserMutation.isPending}
    />
  )
}
