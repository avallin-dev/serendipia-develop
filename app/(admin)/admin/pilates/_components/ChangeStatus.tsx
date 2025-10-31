'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from '@/app/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import useConfirm from '@/app/hooks/use-confirm'
import { pilateChangeStatusSchema, pilateChangeStatusSchmaType } from '@/app/schemas/pilate'
import {
  useDeletePilate,
  useDeletePilateAll,
  useAddFAPState,
} from '@/app/services/mutations/pilate'
import { usePartnerMemberships } from '@/app/services/queries/partner'
import { usePartnerMembershipWithPilates } from '@/app/services/queries/pilate'
import { PilateType } from '@/app/types/pilate'

type UpdateProps = {
  onClose: () => void
  open: boolean
  selected?: PilateType
}

export default function ChangeStatus({ onClose, open, selected }: UpdateProps) {
  const queryClient = useQueryClient()
  const { partnerMemberships } = usePartnerMemberships(selected?.idSocio?.toString() || '')

  const addFapPilateMutation = useAddFAPState()
  const deletePilateMutation = useDeletePilate()
  const deletePilateAllMutation = useDeletePilateAll()
  const { partnerMembership } = usePartnerMembershipWithPilates(selected?.idSocio)
  const form = useForm<pilateChangeStatusSchmaType>({
    resolver: zodResolver(pilateChangeStatusSchema),
    defaultValues: {
      fap: selected?.fap,
    },
  })
  const [ConfirmationDialog, confirm] = useConfirm(
    'Si',
    `¿Seguro quieres eliminar todas las clases del socio en esta hora?`
  )

  async function onSubmit(values: pilateChangeStatusSchmaType) {
    const id = selected?.id
    const fap = values.fap
    addFapPilateMutation.mutate(
      { fap: fap!, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['pilate'],
          })
          toast.success('Estado de clase pilates editado exitosamente')
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  async function handleDelete() {
    const day = selected?.start.getDay().toString()
    const horas = selected?.start.getHours().toString().padStart(2, '0')
    const minutos = selected?.start.getMinutes().toString().padStart(2, '0')
    const horaFormato = `${horas}:${minutos}`
    const selectedPartnerMembership = partnerMembership?.filter(
      (e) => e.day === day && e.time === horaFormato
    )
    if (selectedPartnerMembership && selectedPartnerMembership?.length > 0) {
      const id = selectedPartnerMembership[0].id
      await onDeleteAll(id)
    } else {
      await onDelete()
    }
  }

  async function onDelete() {
    const id = selected?.id
    deletePilateMutation.mutate(id!, {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['pilate'],
        })
        toast.success('Clase eliminada exitosamente')
        onClose()
      },
      onError(error) {
        console.error(error)
        toast.error('Error inesperado. Intente mas tarde')
      },
    })
  }

  async function onDeleteAll(id: number) {
    const ok = await confirm()
    if (ok) {
      deletePilateAllMutation.mutate(id, {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['pilate'],
          })
          toast.success('Clase eliminada exitosamente')
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      })
    }
  }

  const bodyContent = (
    <div>
      <ConfirmationDialog />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="fap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la clase</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="F">FALTA</SelectItem>
                            <SelectItem value="P">PRESENTE</SelectItem>
                            <SelectItem value="A">AUSENTE</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`Editar estado de clase del socio ${selected?.title}`}
      description={
        partnerMemberships[0]
          ? `Desde el ${format(partnerMemberships[0].fechaInicioMembresia!, "d 'de' MMM", {
              locale: es,
            })} hasta el ${format(partnerMemberships[0].Vencimiento!, "d 'de' MMM", {
              locale: es,
            })}`
          : ''
      }
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      onDelete={handleDelete}
      actionLabel="Editar"
      disabled={addFapPilateMutation.isPending}
      isLoading={addFapPilateMutation.isPending}
    />
  )
}
