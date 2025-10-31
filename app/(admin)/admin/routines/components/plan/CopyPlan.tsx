'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { hasSameNamePlan } from '@/app/actions/plan'
import { Combobox } from '@/app/components/Combobox'
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
import { useCopyPlan } from '@/app/services/mutations/plan'
import { usePartnersBoards } from '@/app/services/queries/partner'
import { useAllUsers } from '@/app/services/queries/user'
import { PartnerRoutine } from '@/app/types/partner'
import { PlanType } from '@/app/types/plan'
import formatUTC from '@/app/utils/formatUTC'

type CopyPlanProps = {
  onClose: () => void
  open: boolean
  plan?: PlanType
  setPartner: (partner: PartnerRoutine) => void
  setPlan: (arg: PlanType) => void
}

export default function CopyPlan({ onClose, open, plan, setPartner, setPlan }: CopyPlanProps) {
  const queryClient = useQueryClient()
  const copyPlanMutation = useCopyPlan()
  const { users } = useAllUsers()
  const { partners } = usePartnersBoards()
  const partnerData = partners.map((e) => ({
    value: e.idSocio.toString(),
    label: `${e.Nombre ? e.Nombre : ''} ${e.Paterno ? e.Paterno : ''} ${e.DNI ? '- ' + e.DNI : ''}`,
  }))
  const form = useForm<planSchmaType>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      dias: plan?.dias ?? 0,
      NombrePlan: plan?.NombrePlan ?? '',
      partnerId: plan?.idSocio?.toString() ?? '',
      idUsuario: plan?.idUsuario?.toString() ?? '',
      semanas: plan?.semanas ?? 0,
      fechaCreacion: plan?.fechaCreacion ? plan.fechaCreacion : undefined,
      type_of_training: plan?.type_of_training ?? undefined,
      teacher_comments: plan?.teacher_comments ?? '',
    },
  })

  async function onSubmit(values: planSchmaType) {
    const id = plan?.idPlan
    const idPartner = values.partnerId
    const hasSameName = await hasSameNamePlan(parseInt(idPartner!), values.NombrePlan)
    if (hasSameName) {
      if (!window.confirm(`Deseas sobrescribir ${values.NombrePlan}?`)) {
        return
      }
    }
    copyPlanMutation.mutate(
      { id: id!, data: { ...values, fechaCreacion: formatUTC(values.fechaCreacion) } },
      {
        onSuccess({ partner, plan }) {
          queryClient.invalidateQueries({
            queryKey: ['plan', idPartner],
          })
          toast.success('Plan copiado exitosamente')
          setPartner(partner!)
          setPlan(plan)
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
        <div className="grid gap-4 py-4">
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
                <FormItem className="space-y-2">
                  <FormLabel>Selecciona socio</FormLabel>
                  <Combobox
                    data={partnerData}
                    placeholder="Socios"
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
      title="Copiar plan"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Copiar"
      disabled={copyPlanMutation.isPending}
      isLoading={copyPlanMutation.isPending}
    />
  )
}
