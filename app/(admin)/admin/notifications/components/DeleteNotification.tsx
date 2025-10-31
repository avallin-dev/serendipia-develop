'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteNotification } from '@/app/services/mutations/notification'

type DeleteProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteReadme({ id, onClose, open }: DeleteProps) {
  const queryClient = useQueryClient()
  const deleteNotificationMutation = useDeleteNotification()

  async function onDelete() {
    deleteNotificationMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['notification'],
        })
        toast.success('Notificación eliminada exitosamente')
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
      title="¿Quieres eliminar esta notificación?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteNotificationMutation.isPending}
      isLoading={deleteNotificationMutation.isPending}
    />
  )
}
