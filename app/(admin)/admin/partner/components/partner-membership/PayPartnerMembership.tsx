'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { sociomembresia, sociomembresia_pago } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { payMembershipSchema, partnerMembershipType } from '@/app/schemas/pay-membership'
import { useCreatePayMembership } from '@/app/services/mutations/membership'

type PayPartnerMembershipProps = {
  onClose: () => void
  open: boolean
  membershipId?: number
  partnerId?: number
  setStep: (arg: string) => void
  partnerMembership?: sociomembresia & { sociomembresia_pago: sociomembresia_pago[] }
}

export default function PayPartnerMembership({
  onClose,
  open,
  membershipId,
  partnerId,
  setStep,
  partnerMembership,
}: PayPartnerMembershipProps) {
  const queryClient = useQueryClient()
  const createPayMembershipMutation = useCreatePayMembership()
  const form = useForm<partnerMembershipType>({
    resolver: zodResolver(payMembershipSchema),
    defaultValues: {
      observacion:
        partnerMembership?.sociomembresia_pago?.[partnerMembership?.sociomembresia_pago.length - 1]
          ?.observacion ?? '',
      importe: partnerMembership?.sociomembresia_pago
        ? Number(
            partnerMembership?.sociomembresia_pago?.[
              partnerMembership?.sociomembresia_pago.length - 1
            ]?.importe
          )
        : 0.0,
    },
  })

  async function onSubmit(values: partnerMembershipType) {
    createPayMembershipMutation.mutate(
      { data: { ...values, idSocioMembresia: membershipId! }, id: partnerId! },
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
                name="observacion"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="rounded-full" />
                    </FormControl>
                    <div className="h-4">
                      <FormMessage className="mt-1 text-xs tracking-wide" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="importe"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Importe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(event) => field.onChange(+event.target.value)}
                        className="hide_arrows rounded-full"
                        step="0.01"
                        min={0}
                      />
                    </FormControl>
                    <div className="h-4">
                      <FormMessage className="mt-1 text-xs tracking-wide" />
                    </div>
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
      title="Guardar pago de membresia"
      body={body}
      onSubmit={form.handleSubmit(onSubmit)}
      className="overflow-y-visible"
      actionLabel="Guardar"
      disabled={createPayMembershipMutation.isPending}
      isLoading={createPayMembershipMutation.isPending}
    />
  )
}
