'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { socio } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { GroupBase } from 'react-select'
import { toast } from 'sonner'

import { SelectComponent } from '@/app/components/createable-select'
import PhoneInput from '@/app/components/phone-input'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import { updatePartnerSchema, updateSampleType } from '@/app/schemas/partner'
import { useUpdatePartner } from '@/app/services/mutations/partner'
import formatUTC from '@/app/utils/formatUTC'
import ModalWrapper from '@/components/ModalWrapper'

type ModalUpdatePartnerProps = {
  partner: socio
  onClose: () => void
  open: boolean
}

type Option = GroupBase<string> & {
  value: string
  label: string
}

const condicionesMedicas = [
  { value: 'Cervical', label: 'Cervical' },
  { value: 'Hombro', label: 'Hombro' },
  { value: 'Espalda baja', label: 'Espalda baja' },
  { value: 'Cadera', label: 'Cadera' },
  { value: 'Rodilla', label: 'Rodilla' },
  { value: 'Tobillo', label: 'Tobillo' },
  { value: 'Codo', label: 'Codo' },
  { value: 'Muñeca', label: 'Muñeca' },
  { value: 'Hipertensión', label: 'Hipertensión' },
  { value: 'Hiperlaxo', label: 'Hiperlaxo' },
]

export default function ModalUpdatePartner({ onClose, partner, open }: ModalUpdatePartnerProps) {
  const queryClient = useQueryClient()
  const updatePartnerMutation = useUpdatePartner()

  const form = useForm<updateSampleType>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: {
      Nombre: partner?.Nombre !== null ? partner?.Nombre : '',
      Paterno: partner?.Paterno !== null ? partner?.Paterno : '',
      Materno: partner?.Materno !== null ? partner?.Materno : '',
      DNI: partner?.DNI !== null ? partner?.DNI : '',
      Telefono:
        partner?.Telefono !== null
          ? partner?.Telefono.includes('+')
            ? partner?.Telefono
            : `+54${partner?.Telefono}`
          : '',
      Observaciones: partner?.Observaciones !== null ? partner?.Observaciones : '',
      clave: partner?.clave !== null ? partner?.clave : '',
      fechaNacimiento: partner?.fechaNacimiento ? partner.fechaNacimiento : undefined,
      correo: partner?.correo !== null ? partner?.correo : '',
      nivel: partner?.nivel ?? 'INICIAL',
      condicionMedica: partner?.condicionMedica ?? '',
      authorization: (partner as { authorization?: number })?.authorization ?? 0,
    },
  })

  async function onSubmit(values: updateSampleType) {
    const id = partner?.idSocio
    updatePartnerMutation.mutate(
      { data: { ...values, fechaNacimiento: formatUTC(values.fechaNacimiento) }, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['partner', id.toString()],
          })
          toast.success('Socio actualizado exitosamente')
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
            <FormField
              control={form.control}
              name="Paterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido paterno</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="rounded-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Materno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido materno</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="rounded-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nivel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Niveles</SelectLabel>
                          <SelectItem value="AVANZADO">AVANZADO</SelectItem>
                          <SelectItem value="INTERMEDIO">INTERMEDIO</SelectItem>
                          <SelectItem value="INICIAL">INICIAL</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="DNI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="333999666"
                      className="hide_arrows rounded-full"
                      minLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} country="ar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>correo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="ejemplo@mail.com"
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clave"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clave</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="rounded-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <Input
                    type="date"
                    className="rounded-full"
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
              name="condicionMedica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patología</FormLabel>
                  <FormControl>
                    <SelectComponent
                      createAble={true}
                      options={condicionesMedicas as Option[]}
                      placeholder="Selecciona patología"
                      {...field}
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
      title="Actualizar Socio"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Actualizar Socio"
      disabled={updatePartnerMutation.isPending}
      isLoading={updatePartnerMutation.isPending}
    />
  )
}
