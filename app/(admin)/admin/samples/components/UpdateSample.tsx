'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { updateSampleSchema, updateSampleType } from '@/app/schemas/sample/sample'
import { useUpdateSample } from '@/app/services/mutations/sample/sample'
import type { Sample_Muestra } from '@/app/types/sample'
import formatUTC from '@/app/utils/formatUTC'
import ModalWrapper from '@/components/ModalWrapper'

type ModalUpdateSampleProps = {
  sample: Sample_Muestra | null
  onClose: () => void
  open: boolean
}

export default function ModalUpdateSample({ onClose, sample, open }: ModalUpdateSampleProps) {
  const queryClient = useQueryClient()
  const updateSampleMutation = useUpdateSample()

  const form = useForm<updateSampleType>({
    resolver: zodResolver(updateSampleSchema),
    defaultValues: {
      weight: sample?.peso,
      height: sample?.estatura,
      porcentageFat: sample?.porcentajeGrasaCorporal,
      porcentageMass: sample?.porcentajeMasaMuscular,
      observation: sample?.observacion ? sample.observacion : undefined,
      dateSample: sample?.fechaMuestra ? sample.fechaMuestra : undefined,
    },
  })

  async function onSubmit(values: updateSampleType) {
    const id = sample?.id
    updateSampleMutation.mutate(
      { data: { ...values, dateSample: formatUTC(values.dateSample) }, id: id! },
      {
        onSuccess({ data }) {
          queryClient.invalidateQueries({
            queryKey: ['samples'],
          })
          toast.success(data.message)
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
              name="dateSample"
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
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="rounded-full"
                      step="0.01"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="rounded-full"
                      step="0.01"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="porcentageFat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porcentaje de Grasa Corporal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="rounded-full"
                      step="0.01"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="porcentageMass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porcentaje de Masa Muscular</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(event) => field.onChange(+event.target.value)}
                      className="rounded-full"
                      step="0.01"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación</FormLabel>
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
      title="Editar muestra"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar muestra"
      disabled={updateSampleMutation.isPending}
      isLoading={updateSampleMutation.isPending}
    />
  )
}
