'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeletePartner } from '@/app/services/mutations/partner'

type ModalDeletePartnerProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function ModalDeletePartner({ id, onClose, open }: ModalDeletePartnerProps) {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const router = useRouter()
  const deletepartnerMutation = useDeletePartner()

  async function onDelete() {
    deletepartnerMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['partner', id],
        })
        toast.success('Socio eliminado correctamente')
        router.push(pathname!)
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
      title="Quieres eliminar al socio"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deletepartnerMutation.isPending}
      isLoading={deletepartnerMutation.isPending}
    />
  )
}
