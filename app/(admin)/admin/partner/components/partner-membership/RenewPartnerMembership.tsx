'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { sociomembresia } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { add } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { partnerMembershipSchema, partnerMembershipType } from '@/app/schemas/partner-membership'
import { useRenewPartnerMembership } from '@/app/services/mutations/partner'
import formatUTC from '@/app/utils/formatUTC'

type RenewPartnerMembershipProps = {
  onClose: () => void
  open: boolean
  partnerMembership?: sociomembresia
  setStep: (arg: string) => void
}

export default function UpdatePartnerMembership({
  onClose,
  open,
  partnerMembership,
  setStep,
}: RenewPartnerMembershipProps) {
  const queryClient = useQueryClient()
  const renewPartnerMembershipMutation = useRenewPartnerMembership()

  const Vencimiento = partnerMembership?.Vencimiento
  const months = partnerMembership?.meses
  const days = partnerMembership?.dias
  const weeks = partnerMembership?.semanas

  const form = useForm<partnerMembershipType>({
    resolver: zodResolver(partnerMembershipSchema),
    defaultValues: {
      fechaInicioMembresia: Vencimiento! ?? undefined,
      Vencimiento:
        add(Vencimiento!, {
          months: months!,
          days: days!,
          weeks: weeks!,
        }) ?? undefined,
      idMembresia: partnerMembership?.idMembresia?.toString() ?? '',
    },
  })

  async function onSubmit(values: partnerMembershipType) {
    const id = partnerMembership?.idSocioMembresia
    renewPartnerMembershipMutation.mutate(
      {
        data: {
          fechaInicioMembresia: formatUTC(values.fechaInicioMembresia),
          Vencimiento: formatUTC(values.Vencimiento),
        },
        id: id!,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['partner-membership', partnerMembership?.idSocio?.toString()],
          })
          toast.success('Edición exitosa')
          setStep('table')
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  const body = (
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
      title="Renovar afiliación a membresia"
      body={body}
      onSubmit={form.handleSubmit(onSubmit)}
      className="overflow-y-visible"
      actionLabel="Confirmar"
      disabled={renewPartnerMembershipMutation.isPending}
      isLoading={renewPartnerMembershipMutation.isPending}
    />
  )
}
