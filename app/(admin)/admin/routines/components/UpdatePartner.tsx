'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { updatePartnerSchema, updateSampleType } from '@/app/schemas/partner'
import { useCreatePartner, useUpdatePartner } from '@/app/services/mutations/partner'
import type { PartnerRoutine } from '@/app/types/partner'
import ModalWrapper from '@/components/ModalWrapper'

type ModalUpdatePartnerProps = {
  partner?: PartnerRoutine | null
  onClose: () => void
  open: boolean
  type: 'bloque' | 'grupo' | 'socio'
  isUpdate: boolean
}

export function UpdatePartner({ onClose, partner, open, type, isUpdate }: ModalUpdatePartnerProps) {
  const queryClient = useQueryClient()
  const createPartnerMutation = useCreatePartner()
  const updatePartnerMutation = useUpdatePartner()

  const form = useForm<updateSampleType>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: {
      Nombre: partner?.Nombre !== null ? (isUpdate ? partner?.Nombre : '') : '',
    },
  })

  async function onSubmit(values: updateSampleType) {
    const id = partner?.idSocio
    if (id && isUpdate) {
      updatePartnerMutation.mutate(
        { data: { ...values }, id: id! },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['partnerType', type],
            })
            toast.success('Actualizado exitosamente')
            onClose()
          },
          onError(error) {
            console.error(error)
            toast.error('Error inesperado. Intente mas tarde')
          },
        }
      )
    } else {
      createPartnerMutation.mutate(
        { data: { ...values }, type },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['partnerType', type],
            })
            toast.success('Creacion exitosa')
            onClose()
          },
          onError(error) {
            console.error(error)
            toast.error('Error inesperado. Intente mas tarde')
          },
        }
      )
    }
  }

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="Nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="rounded-full" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`${isUpdate ? 'Actualizar' : 'Crear'} ${type}`}
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel={`${isUpdate ? 'Actualizar' : 'Crear'} ${type}`}
      disabled={updatePartnerMutation.isPending}
      isLoading={updatePartnerMutation.isPending}
    />
  )
}
