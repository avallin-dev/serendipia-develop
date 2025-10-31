'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteRole } from '@/app/services/mutations/role'

type DeleteRoleProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function DeleteRole({ id, onClose, open }: DeleteRoleProps) {
  const queryClient = useQueryClient()
  const deleteRoleMutation = useDeleteRole()

  async function onDelete() {
    deleteRoleMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['role'],
        })
        toast.success('Rol eliminado exitosamente')
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
      title="¿Quieres eliminar este rol?"
      body={<div>Asegúrate de no tener usuarios relacionados a este rol antes de eliminar</div>}
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteRoleMutation.isPending}
      isLoading={deleteRoleMutation.isPending}
    />
  )
}
