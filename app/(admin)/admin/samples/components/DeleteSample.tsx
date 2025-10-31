'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteSample } from '@/app/services/mutations/sample/sample'

type ModalDeleteSampleProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function ModalDeleteSample({ id, onClose, open }: ModalDeleteSampleProps) {
  const queryClient = useQueryClient()
  const deleteSampleMutation = useDeleteSample()

  async function onDelete() {
    deleteSampleMutation.mutate(id!, {
      onSuccess({ data }) {
        queryClient.invalidateQueries({
          queryKey: ['samples'],
        })
        toast.success(data.message)
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
      title="Quieres eliminar muestra"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteSampleMutation.isPending}
      isLoading={deleteSampleMutation.isPending}
    />
  )
}
