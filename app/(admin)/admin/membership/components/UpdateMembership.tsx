'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { membresia } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { membershipSchema, membershipSchmaType } from '@/app/schemas/membership'
import { useUpdateMembership } from '@/app/services/mutations/membership'

type ModalUpdateMembershipProps = {
  data?: membresia & { idMembresia: number }
  onClose: () => void
  open: boolean
}

export default function ModalUpdateSample({ onClose, data, open }: ModalUpdateMembershipProps) {
  const queryClient = useQueryClient()
  const updateMembershipMutation = useUpdateMembership()

  const form = useForm<membershipSchmaType>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      meses: data?.meses ? data?.meses : 0,
      dias: data?.dias ? data?.dias : 0,
      horaFinal: data?.horaFinal ? format(data.horaFinal, 'HH:mm') : '',
      horaInicio: data?.horaInicio ? format(data.horaInicio, 'HH:mm') : '',
      idTipoMembresia: data?.idTipoMembresia?.toString(),
      Nombre: data?.Nombre ? data?.Nombre : '',
      Precio: data?.Precio ? Number(data.Precio) : 0,
      semanas: data?.semanas ? data?.semanas : 0,
    },
  })

  async function onSubmit(values: membershipSchmaType) {
    const id = data?.idMembresia
    updateMembershipMutation.mutate(
      { data: values, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['membership'],
          })
          toast.success('Membresia actualizada exitosamente')
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
          <div className="grid w-full grid-cols-1 grid-rows-2 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="Nombre"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Nombre</FormLabel>
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
              name="idTipoMembresia"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Tipo de membresia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      <SelectItem value="1">Mensual</SelectItem>
                      <SelectItem value="2">Semanal</SelectItem>
                      <SelectItem value="3">Dias</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="Precio"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Precio</FormLabel>
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
            <FormField
              control={form.control}
              name="horaInicio"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Hora de inicio</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" className="rounded-full" />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horaFinal"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Hora final</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" className="rounded-full" />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meses"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Meses</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="hide_arrows rounded-full"
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semanas"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Semanas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="hide_arrows rounded-full"
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dias"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Dias</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="hide_arrows rounded-full"
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
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Editar membresia"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updateMembershipMutation.isPending}
      isLoading={updateMembershipMutation.isPending}
    />
  )
}
