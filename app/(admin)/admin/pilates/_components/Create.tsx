'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Combobox } from '@/app/components/Combobox'
import ModalWrapper from '@/app/components/ModalWrapper'
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { pilateSchema, pilateSchmaType } from '@/app/schemas/pilate'
import { useCreatePilate } from '@/app/services/mutations/pilate'
import { usePartnerWithPilates } from '@/app/services/queries/partner'

type CreateProps = {
  onClose: () => void
  open: boolean
  selectedSlot: { start?: Date; end?: Date }
}

export default function Create({ onClose, open, selectedSlot }: CreateProps) {
  const queryClient = useQueryClient()
  const createPilateMutation = useCreatePilate()
  const [selectedPartnerMembershipTerm, setSelectedPartnerMembershipTerm] = useState<
    string | undefined
  >()
  const [selectedPartnerMembership, setSelectedPartnerMembership] = useState<string | undefined>()

  const form = useForm<pilateSchmaType>({
    resolver: zodResolver(pilateSchema),
    defaultValues: {
      idSocio: '',
      title: '',
      classType: 'disponible',
      start: selectedSlot?.start,
      end: selectedSlot?.end,
    },
  })
  const { partners } = usePartnerWithPilates()

  const partnerData = partners.map((e) => {
    const fechaInicioMembresia = e.sociomembresia[0].fechaInicioMembresia
    const Vencimiento = e.sociomembresia[0].Vencimiento
    return {
      value: e.idSocio.toString(),
      label: `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''} `,
      membershipTitle: e.sociomembresia[0].membresia.Nombre,
      membershipTerm: `Desde el ${format(fechaInicioMembresia!, "d 'de' MMM", {
        locale: es,
      })} hasta el ${format(Vencimiento!, "d 'de' MMM", { locale: es })}. Tiene ${e
        ?.sociomembresia[0].clases_restantes} disponibles`,
    }
  })

  const classType = form.watch('classType')

  async function onSubmit(values: pilateSchmaType) {
    createPilateMutation.mutate(
      { data: values },
      {
        onSuccess({ message }) {
          queryClient.invalidateQueries({
            queryKey: ['pilate'],
          })
          toast.success(message)
          onClose()
        },
        onError(error) {
          toast.error(error.message)
        },
      }
    )
  }

  function handleOnChangePartner({ event, field }) {
    const findPartner = partnerData.find((e) => e.value === event)
    const membershipTitle = findPartner?.membershipTitle
    setSelectedPartnerMembership(membershipTitle!)
    setSelectedPartnerMembershipTerm(findPartner?.membershipTerm)

    field.onChange(event)
  }

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 grid gap-4 py-4">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="classType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Tipo de clase</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Nombre de la categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      <SelectItem value="disponible" className="cursor-pointer">
                        Disponible
                      </SelectItem>
                      {/* <SelectItem value="recuperativa" className="cursor-pointer">
                        Recuperativa
                      </SelectItem> */}
                      <SelectItem value="prueba" className="cursor-pointer">
                        Prueba
                      </SelectItem>
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
            {(classType === 'disponible' || classType === 'recuperativa') && (
              <FormField
                control={form.control}
                name="idSocio"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Selecciona socio</FormLabel>
                    <Combobox
                      data={partnerData}
                      placeholder="Socios"
                      onChange={(event) => handleOnChangePartner({ event, field })}
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
            )}
            {classType === 'prueba' && (
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Titulo de clase</FormLabel>
                    <Input
                      type="text"
                      className="rounded-full"
                      placeholder="Clase de ..."
                      {...field}
                    />
                    <div className="h-4">
                      <div className="h-4">
                        <FormMessage className="mt-1 text-xs tracking-wide" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    className="rounded-full"
                    disabled
                    {...field}
                    value={
                      field.value instanceof Date
                        ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000)
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
              name="end"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    className="rounded-full"
                    {...field}
                    disabled
                    value={
                      field.value instanceof Date
                        ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000)
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
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`Crear clase para socio ${
        selectedPartnerMembership !== undefined ? 'con Plan ' + selectedPartnerMembership : ''
      }`}
      body={bodyContent}
      description={selectedPartnerMembershipTerm !== undefined ? selectedPartnerMembershipTerm : ''}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={createPilateMutation.isPending}
      isLoading={createPilateMutation.isPending}
    />
  )
}
