'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { GroupBase } from 'react-select'
import { toast } from 'sonner'

import { getPartnerByDNI } from '@/app/actions/partner'
import { SelectComponent } from '@/app/components/createable-select'
import ModalWrapper from '@/app/components/ModalWrapper'
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
import { useQueryString } from '@/app/hooks/use-query-string'
import { partnerType, partnerchema } from '@/app/schemas/partner'
import { useCreatePartner } from '@/app/services/mutations/partner'
import formatUTC from '@/app/utils/formatUTC'
type ModalCreatePartnerProps = {
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

export default function ModalCreatePartner({ onClose, open }: ModalCreatePartnerProps) {
  const queryClient = useQueryClient()
  const createPartnerMutation = useCreatePartner()
  const { pushQueryString } = useQueryString()
  const form = useForm<partnerType>({
    resolver: zodResolver(partnerchema),
    defaultValues: {
      Nombre: '',
      Paterno: '',
      Materno: '',
      DNI: '',
      Telefono: '',
      Observaciones: '',
      clave: '',
      fechaNacimiento: undefined,
      correo: '',
      nivel: 'INICIAL',
      condicionMedica: '',
    },
  })

  async function onSubmit(values: partnerType) {
    const DNI = values.DNI
    const exist = await getPartnerByDNI(DNI!)
    if (exist) {
      form.setError('DNI', {
        type: 'manual',
        message: 'El DNI ya está registrado. Intente con otro.',
      })
      return
    }
    createPartnerMutation.mutate(
      { data: { ...values, fechaNacimiento: formatUTC(values.fechaNacimiento) } },
      {
        onSuccess(id) {
          queryClient.invalidateQueries({
            queryKey: ['partner'],
          })
          toast.success('Creacion exitosa')
          pushQueryString('partner', id.toString())
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
      title="Crear socio"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear socio"
      disabled={createPartnerMutation.isPending}
      isLoading={createPartnerMutation.isPending}
    />
  )
}
