'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeleteVentaProductoMutation } from '@/app/services/mutations/venta_producto'

type ModalDeleteProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function Delete({ id, onClose, open }: ModalDeleteProps) {
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteVentaProductoMutation()

  async function onDelete() {
    deleteMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['venta-productos'],
        })
        toast.success('Producto eliminado exitosamente')
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
      title="¿Quieres eliminar este producto?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deleteMutation.isPending}
      isLoading={deleteMutation.isPending}
    />
  )
}
