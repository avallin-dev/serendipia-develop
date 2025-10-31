'use client'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { useDeletePartnerPic } from '@/app/services/mutations/partner'

type ModalDeletePicProps = {
  id?: number
  onClose: () => void
  open: boolean
}

export default function ModalDeletePic({ id, onClose, open }: ModalDeletePicProps) {
  const queryClient = useQueryClient()
  const deletePicMutation = useDeletePartnerPic()

  async function onDelete() {
    deletePicMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['partner', id?.toString()],
        })
        toast.success('Imagen de perfil del socio eliminado correctamente')
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
      title="Quieres eliminar la imagen de perfil?"
      onSubmit={onDelete}
      actionLabel="Si"
      disabled={deletePicMutation.isPending}
      isLoading={deletePicMutation.isPending}
    />
  )
}
