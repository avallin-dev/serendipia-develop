'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { socio } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Combobox } from '@/app/components/Combobox'
import { Form, FormField, FormMessage, FormItem, FormLabel } from '@/app/components/ui/form'
import { useAddMember } from '@/app/services/mutations/partner'
import ModalWrapper from '@/components/ModalWrapper'

type ModalAddMemberProps = {
  onClose: () => void
  open: boolean
  type: 'bloque' | 'grupo' | 'socio'
  partners: socio[]
  partnerId: number
  setMembersState: (members: socio[]) => void
}

export function AddMember({
  onClose,
  open,
  partners,
  partnerId,
  setMembersState,
}: ModalAddMemberProps) {
  const addMemberMutation = useAddMember()
  const form = useForm<{ idSocio: string }>({
    resolver: zodResolver(
      z.object({
        idSocio: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
      })
    ),
    defaultValues: {
      idSocio: '',
    },
  })

  const partnerData = partners.map((e) => ({
    value: e.idSocio.toString(),
    label: `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''}`,
  }))

  async function onSubmit(values: { idSocio: string }) {
    addMemberMutation.mutate(
      { data: { idSocio: parseInt(values.idSocio) }, id: partnerId },
      {
        onSuccess(data) {
          form.reset()
          if (data) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMembersState((prev: socio[]) => [...prev, data])
          }
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

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="idSocio"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Selecciona socio</FormLabel>
                  <Combobox
                    data={partnerData}
                    placeholder="Socios"
                    onChange={(event) => field.onChange(event)}
                    value={field.value!}
                  />
                  <div className="h-4">
                    <div className="h-4">
                      <FormMessage className="mt-1 text-xs tracking-wide" />
                    </div>
                  </div>
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
      title={`Añadir Miembro`}
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel={`Añadir Miembro`}
      disabled={addMemberMutation.isPending}
      isLoading={addMemberMutation.isPending}
    />
  )
}
