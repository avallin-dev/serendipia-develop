'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { sociomembresia } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Combobox } from '@/app/components/Combobox'
import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { partnerMembershipSchema, partnerMembershipType } from '@/app/schemas/partner-membership'
import { useCreatePartnerMembership } from '@/app/services/mutations/partner'
import { useAllMemberships } from '@/app/services/queries/membership'
import formatUTC from '@/app/utils/formatUTC'

type CreatePartnerMembershipProps = {
  onClose: () => void
  open: boolean
  partnerMemberships?: sociomembresia[]
  partnerId?: number
  setStep: (arg: string) => void
}

export default function CreatePartnerMembership({
  onClose,
  open,
  partnerId,
  setStep,
}: CreatePartnerMembershipProps) {
  const queryClient = useQueryClient()
  const createPartnerMembershipMutation = useCreatePartnerMembership()
  const { memberships } = useAllMemberships()
  const membershipData = memberships?.map((e) => ({
    value: e.idMembresia.toString(),
    label: e.Nombre!,
  }))

  const form = useForm<partnerMembershipType>({
    resolver: zodResolver(partnerMembershipSchema),
    defaultValues: {
      fechaInicioMembresia: undefined,
      Vencimiento: undefined,
      idMembresia: '',
    },
  })

  async function onSubmit(values: partnerMembershipType) {
    createPartnerMembershipMutation.mutate(
      {
        data: {
          ...values,
          idMembresia: parseInt(values.idMembresia),
          fechaInicioMembresia: formatUTC(values.fechaInicioMembresia),
          Vencimiento: formatUTC(values.Vencimiento),
        },
        id: partnerId!,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['partner-membership', partnerId?.toString()],
          })
          toast.success('Creacion exitosa')
          setStep('table')
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  const createContent = (
    <>
      <div className="mb-2 flex justify-end gap-x-2">
        <Button
          variant="outline"
          className="h-10 px-3 text-xs"
          type="button"
          size="sm"
          onClick={() => {
            setStep('table')
          }}
        >
          Volver
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="idMembresia"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Selecciona membresia</FormLabel>
                    <Combobox
                      data={membershipData || []}
                      placeholder="Nombre de la membresia"
                      onChange={field.onChange}
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
              <FormField
                control={form.control}
                name="fechaInicioMembresia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Input
                      type="date"
                      className="rounded-full"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? new Date(
                              field.value.getTime() - field.value.getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .split('T')[0]
                          : field.value
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Vencimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de vencimiento</FormLabel>
                    <Input
                      type="date"
                      className="rounded-full"
                      {...field}
                      value={
                        field.value instanceof Date
                          ? new Date(
                              field.value.getTime() - field.value.getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .split('T')[0]
                          : field.value
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Afiliar a nueva membresia"
      body={createContent}
      onSubmit={form.handleSubmit(onSubmit)}
      className="overflow-y-visible"
      actionLabel="Afiliar"
      disabled={createPartnerMembershipMutation.isPending}
      isLoading={createPartnerMembershipMutation.isPending}
    />
  )
}
