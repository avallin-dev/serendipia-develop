'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { toast } from 'sonner'

import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { configurationSchema, configSchmaType } from '@/app/schemas/configuration'
import { useUpdateConfig } from '@/app/services/mutations/configuration'

type SetupType = {
  mensajeVencimiento: number | null
  formularyTitle: string | null
  fechaModificacion: Date | null
  cantidadBaja: number | null
  cantidadAlta: number | null
  cantidadActual: number | null
  instrucciones: string | null
} | null

export default function UpdateConfig({ setup }: { setup: SetupType }) {
  const queryClient = useQueryClient()
  const updateSetupMutation = useUpdateConfig()

  const form = useForm<configSchmaType>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      formularyTitle: setup?.formularyTitle ?? '',
      mensajeVencimiento: setup?.mensajeVencimiento ?? undefined,
      cantidadBaja: setup?.cantidadBaja ?? undefined,
      cantidadAlta: setup?.cantidadAlta ?? undefined,
      cantidadActual: setup?.cantidadActual ?? undefined,
      instrucciones: setup?.instrucciones ?? undefined,
    },
  })

  async function onSubmit(values: configSchmaType) {
    updateSetupMutation.mutate(
      { data: values },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['setup'],
          })
          toast.success('Actualizado correctamente')
        },
        onError() {
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="formularyTitle"
          disabled={updateSetupMutation.isPending}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label>Titulo del Formulario</Label>
              <FormControl>
                <Input type="text" {...field} className="rounded-full" />
              </FormControl>
              <div className="h-4">
                <FormMessage className="mt-1 text-xs tracking-wide" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mensajeVencimiento"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Dias antes de enviar mensaje de vencimiento</FormLabel>
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
          name="cantidadBaja"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Cantidad baja</FormLabel>
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
          name="cantidadAlta"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Cantidad alta</FormLabel>
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
          name="cantidadActual"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Cantidad actual</FormLabel>
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
          name="instrucciones"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Instrucciones del Bot</FormLabel>
                <Link href={'configuration/list-bot'}>
                  <Button variant="secondary" size="sm">
                    Ver respuestas
                  </Button>
                </Link>
              </div>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="md"
          disabled={updateSetupMutation.isPending}
          className="mx-auto mt-10 flex shadow-md shadow-black/20"
        >
          {updateSetupMutation.isPending ? (
            <AiOutlineLoading className="animate-spin text-2xl text-white" />
          ) : (
            <span>Actualizar</span>
          )}
        </Button>
      </form>
    </Form>
  )
}
