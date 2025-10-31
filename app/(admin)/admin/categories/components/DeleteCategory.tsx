'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteCategory } from '@/app/services/mutations/category'

type DeleteRoleProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteRole({ id, onClose, open }: DeleteRoleProps) {
  const queryClient = useQueryClient()
  const deleteCategoryMutation = useDeleteCategory()

  async function onDelete() {
    deleteCategoryMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['category'],
        })
        toast.success('Categoria eliminada exitosamente')
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
      title="¿Quieres eliminar esta categoria?"
      body={
        <div>Asegúrate de no tener ejercicios relacionados a esta categoria antes de eliminar</div>
      }
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteCategoryMutation.isPending}
      isLoading={deleteCategoryMutation.isPending}
    />
  )
}
