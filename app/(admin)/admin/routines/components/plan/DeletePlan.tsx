'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeletePlan } from '@/app/services/mutations/plan'

type ModalDeletePlanProps = {
  id?: number
  onClose: () => void
  open: boolean
  idPartner?: number | null
}

export default function DeletePlan({ id, onClose, open, idPartner }: ModalDeletePlanProps) {
  const queryClient = useQueryClient()
  const deletePlanMutation = useDeletePlan()

  async function onDelete() {
    deletePlanMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['plan', idPartner?.toString()],
        })
        toast.success('Plan eliminado exitosamente')
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
      title="¿Quieres eliminar este plan?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deletePlanMutation.isPending}
      isLoading={deletePlanMutation.isPending}
    />
  )
}
