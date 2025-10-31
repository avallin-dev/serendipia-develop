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
import { Textarea } from '@/app/components/ui/textarea'
import { sampleSchema, sampleType } from '@/app/schemas/sample/sample'
import { useCreateSample } from '@/app/services/mutations/sample/sample'
import formatUTC from '@/app/utils/formatUTC'

type ModalCreateSampleProps = {
  id: number
  onClose: () => void
  open: boolean
}

export default function ModalCreateSample({ id, onClose, open }: ModalCreateSampleProps) {
  const queryClient = useQueryClient()
  const createSampleMutation = useCreateSample()

  const form = useForm<sampleType>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
      porcentageFat: undefined,
      porcentageMass: undefined,
      observation: undefined,
      dateSample: undefined,
    },
  })

  async function onSubmit(values: sampleType) {
    createSampleMutation.mutate(
      { data: { ...values, dateSample: formatUTC(values.dateSample) }, id },
      {
        onSuccess({ data }) {
          queryClient.invalidateQueries({
            queryKey: ['samples', id.toString()],
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
      title="Agregar muestra"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Agregar muestra"
      disabled={createSampleMutation.isPending}
      isLoading={createSampleMutation.isPending}
    />
  )
}
