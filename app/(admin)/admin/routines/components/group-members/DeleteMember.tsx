'use client'

import { socio } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useRemoveMember } from '@/app/services/mutations/partner'
type ModalDeleteMemberProps = {
  id?: number
  onClose: () => void
  open: boolean
  type: 'bloque' | 'grupo' | 'socio'
  setMembersState: (members: socio[]) => void
}

export default function DeleteMember({
  id,
  onClose,
  open,
  type,
  setMembersState,
}: ModalDeleteMemberProps) {
  const queryClient = useQueryClient()
  const removeMemberMutation = useRemoveMember()

  async function onDelete() {
    removeMemberMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['partnerType', type],
        })
        toast.success('Miembro eliminado exitosamente')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setMembersState((prev: socio[]) => prev.filter((member) => member.idSocio !== id))
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
      title="¿Quieres eliminar este miembro?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={removeMemberMutation.isPending}
      isLoading={removeMemberMutation.isPending}
    />
  )
}
