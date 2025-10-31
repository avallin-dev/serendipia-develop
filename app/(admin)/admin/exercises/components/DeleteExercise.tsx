'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteExercise } from '@/app/services/mutations/exercise'

type DeleteExerciseProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteExercise({ id, onClose, open }: DeleteExerciseProps) {
  const queryClient = useQueryClient()
  const deleteExerciseMutation = useDeleteExercise()

  async function onDelete() {
    deleteExerciseMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['exercise'],
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
      disabled={deleteExerciseMutation.isPending}
      isLoading={deleteExerciseMutation.isPending}
    />
  )
}
