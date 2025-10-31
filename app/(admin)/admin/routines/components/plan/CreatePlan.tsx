'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
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
import { Textarea } from '@/app/components/ui/textarea'
import { planSchema, planSchmaType } from '@/app/schemas/plan'
import { useCreatePlan } from '@/app/services/mutations/plan'
import { useAllUsers } from '@/app/services/queries/user'
import { PlanType } from '@/app/types/plan'
import formatUTC from '@/app/utils/formatUTC'

type ModalCreateMembershipProps = {
  onClose: () => void
  open: boolean
  partnerId?: number | null
  setPlan: (plan: PlanType) => void
}

export default function ModalCreatePlan({
  onClose,
  open,
  partnerId,
  setPlan,
}: ModalCreateMembershipProps) {
  const queryClient = useQueryClient()
  const createPlanMutation = useCreatePlan()
  const { users } = useAllUsers()
  const form = useForm<planSchmaType>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      dias: 0,
      NombrePlan: '',
      partnerId: partnerId?.toString(),
      fechaCreacion: undefined,
      idUsuario: '',
      semanas: 0,
      type_of_training: undefined,
      teacher_comments: '',
    },
  })

  async function onSubmit(values: planSchmaType) {
    createPlanMutation.mutate(
      { data: { ...values, fechaCreacion: formatUTC(values.fechaCreacion) } },
      {
        onSuccess(data) {
          queryClient.invalidateQueries({
            queryKey: ['plan', partnerId?.toString()],
          })
          toast.success('Plan creado exitosamente')
          setPlan(data)
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  const typeOfTrainingOptions = [
    { label: 'Salud/Estetico', value: 'Salud_Estetico' },
    { label: 'Deporte', value: 'Deporte' },
    { label: 'Concurrente/Funcional', value: 'Concurrente_Funcional' },
  ]

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 pt-4">
          <div className="grid w-full grid-cols-1 grid-rows-2 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="NombrePlan"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nombre de plan</FormLabel>
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
              name="partnerId"
              render={({ field }) => (
                <FormItem className="hidden space-y-2">
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semanas"
              render={({ field }) => (
                <FormItem className="space-y-2">
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
            <FormField
              control={form.control}
              name="dias"
              render={({ field }) => (
                <FormItem className="space-y-2">
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
            <FormField
              control={form.control}
              name="idUsuario"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Usuario creo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Nombre del usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      {users &&
                        users?.map((user) => (
                          <SelectItem
                            key={`user-${user.idUsuario}`}
                            value={user.idUsuario.toString()}
                            className="cursor-pointer"
                          >
                            {user.Nombre}
                          </SelectItem>
                        ))}
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
              name="fechaCreacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
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
              name="type_of_training"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de entrenamiento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Tipo de entrenamiento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOfTrainingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacher_comments"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Comentarios del instructor</FormLabel>
                  <Textarea {...field} />
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
      title="Agregar plan"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Agregar"
      disabled={createPlanMutation.isPending}
      isLoading={createPlanMutation.isPending}
    />
  )
}
