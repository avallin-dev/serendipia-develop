'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Form, FormControl, FormField, FormMessage, FormItem } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Textarea } from '@/app/components/ui/textarea'
import { notificationchema, notificationType } from '@/app/schemas/notification'
import { useCreateNotification } from '@/app/services/mutations/notification'

type ModalCreateNotificationProps = {
  onClose: () => void
  open: boolean
}

export default function CreateReadme({ onClose, open }: ModalCreateNotificationProps) {
  const queryClient = useQueryClient()
  const createNotificationMutation = useCreateNotification()
  const [isIndividual, setIsIndividual] = useState(false)

  const form = useForm<notificationType>({
    resolver: zodResolver(notificationchema),
    defaultValues: {
      title: '',
      type: 'general',
      link: '',
      details: '',
      dni: '',
    },
  })

  async function onSubmit(values: notificationType) {
    createNotificationMutation.mutate(
      { data: values },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['notification'],
          })
          toast.success('Notificación creado exitosamente')
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente mas tarde')
        },
      }
    )
  }

  const handleOnChange = (e: string) => {
    if (e === 'single') {
      setIsIndividual(true)
    } else {
      setIsIndividual(false)
    }
  }

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>Titulo</Label>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label>Individual o general</Label>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e)
                      handleOnChange(e)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="General" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      <SelectItem value="single">Individual</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            {isIndividual && (
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <Label>DNI</Label>
                    <FormControl>
                      <Input type="text" {...field} className="rounded-full" />
                    </FormControl>
                    <div className="h-4">
                      <FormMessage className="mt-1 text-xs tracking-wide" />
                    </div>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <Label>Enlace</Label>
                  <FormControl>
                    <Input className="rounded-full pr-14" type="url" {...field} />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <Label>Detalles</Label>
                  <FormControl>
                    <Textarea className="pr-14" {...field} />
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
      title="Crear notificación"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={createNotificationMutation.isPending}
      isLoading={createNotificationMutation.isPending}
    />
  )
}
