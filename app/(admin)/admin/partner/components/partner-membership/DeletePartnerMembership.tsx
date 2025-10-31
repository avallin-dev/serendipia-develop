'use client'

import { sociomembresia } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeletePartnerMembership } from '@/app/services/mutations/partner'

type ModalDeletePartnerProps = {
  onClose: () => void
  open: boolean
  partnerMembership?: sociomembresia
  setStep: (arg: string) => void
}

export default function DeletePartnerMembership({
  onClose,
  open,
  partnerMembership,
  setStep,
}: ModalDeletePartnerProps) {
  const queryClient = useQueryClient()
  const deletepartnerMembershipMutation = useDeletePartnerMembership()

  async function onDelete() {
    const id = partnerMembership?.idSocioMembresia
    deletepartnerMembershipMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['partner-membership', partnerMembership?.idSocio?.toString()],
        })
        toast.success('Afiliación de membresia eliminada correctamente')
        setStep('table')
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
      title="Quieres eliminar la afiliación a membresia?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deletepartnerMembershipMutation.isPending}
      isLoading={deletepartnerMembershipMutation.isPending}
    />
  )
}
