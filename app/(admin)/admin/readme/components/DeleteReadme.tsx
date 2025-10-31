'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteReadme } from '@/app/services/mutations/readme'

type DeleteReadmeProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteReadme({ id, onClose, open }: DeleteReadmeProps) {
  const queryClient = useQueryClient()
  const deleteReadmeMutation = useDeleteReadme()

  async function onDelete() {
    deleteReadmeMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['readme'],
        })
        toast.success('Readme eliminado exitosamente')
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
      title="¿Quieres eliminar este readme?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteReadmeMutation.isPending}
      isLoading={deleteReadmeMutation.isPending}
    />
  )
}
