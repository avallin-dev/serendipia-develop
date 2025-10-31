'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteRoutine } from '@/app/services/mutations/routine'

type DeleteRoutineProps = {
  id?: number
  onClose: () => void
  open: boolean
  planId?: number
}

export default function DeleteRoutine({ id, onClose, open, planId }: DeleteRoutineProps) {
  const queryClient = useQueryClient()
  const deleteRoutineMutation = useDeleteRoutine()

  async function onDelete() {
    deleteRoutineMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['routine', planId],
        })
        toast.success('Ejercicio eliminado exitosamente')
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
      title="¿Quieres eliminar este ejercicio?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteRoutineMutation.isPending}
      isLoading={deleteRoutineMutation.isPending}
    />
  )
}
