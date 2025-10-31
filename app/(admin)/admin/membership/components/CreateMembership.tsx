'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
import { useCreateMembership } from '@/app/services/mutations/membership'

type ModalCreateMembershipProps = {
  onClose: () => void
  open: boolean
}

export default function ModalCreateMembership({ onClose, open }: ModalCreateMembershipProps) {
  const [typeMembership, setTypeMembership] = useState('1')
  const queryClient = useQueryClient()
  const createMembershipMutation = useCreateMembership()

  type formType = typeof form
  const form = useForm<membershipSchmaType>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      meses: 0,
      dias: 0,
      horaFinal: '',
      horaInicio: '',
      idTipoMembresia: '1',
      Nombre: '',
      Precio: 0.0,
      semanas: 0,
    },
  })

  async function onSubmit(values: membershipSchmaType) {
    createMembershipMutation.mutate(
      { data: values },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['membership'],
          })
          toast.success('Membresia creada exitosamente')
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  const TypeMembershipInput = ({
    membershipKey,
    form,
  }: {
    membershipKey: string
    form: formType
  }) => {
    switch (membershipKey) {
      case '1':
        return (
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
                    onFocus={(e) => e.target.select()}
                    className="hide_arrows rounded-full"
                  />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="mt-1 text-xs tracking-wide" />
                </div>
              </FormItem>
            )}
          />
        )
        break
      case '2':
        return (
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
                    onFocus={(e) => e.target.select()}
                    className="hide_arrows rounded-full"
                  />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="mt-1 text-xs tracking-wide" />
                </div>
              </FormItem>
            )}
          />
        )
      case '3':
        return (
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
                    onFocus={(e) => e.target.select()}
                    className="hide_arrows rounded-full"
                  />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="mt-1 text-xs tracking-wide" />
                </div>
              </FormItem>
            )}
          />
        )
      default:
        break
    }
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
                  <Select
                    onValueChange={(event) => {
                      setTypeMembership(event)
                      field.onChange(event)
                    }}
                    defaultValue={field.value}
                  >
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
            <TypeMembershipInput membershipKey={typeMembership} form={form} />
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
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Agregar membresia"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Agregar"
      disabled={createMembershipMutation.isPending}
      isLoading={createMembershipMutation.isPending}
    />
  )
}
