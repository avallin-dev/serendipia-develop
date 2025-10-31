'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
import { useUpdateNotification } from '@/app/services/mutations/notification'
import { NotificationType } from '@/app/types/notification'

type UpdateNotificationProps = {
  onClose: () => void
  open: boolean
  selected?: NotificationType
}

export default function UpdateReadme({ onClose, open, selected }: UpdateNotificationProps) {
  const queryClient = useQueryClient()
  const updateReadmeMutation = useUpdateNotification()
  const [isIndividual, setIsIndividual] = useState(false)
  useEffect(() => {
    if (selected?.general !== undefined) {
      setIsIndividual(!selected.general)
    }
  }, [selected])

  const form = useForm<notificationType>({
    resolver: zodResolver(notificationchema),
    defaultValues: {
      title: selected?.title ?? '',
      type: selected?.general ? 'general' : 'single',
      link: selected?.externalLink ?? '',
      details: selected?.details ?? '',
      dni: selected?.user?.DNI ?? '',
    },
  })

  async function onSubmit(values: notificationType) {
    const id = selected?.id
    updateReadmeMutation.mutate(
      { data: values, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['notification'],
          })
          toast.success('Notificación actualizada exitosamente')
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
      title="Editar readme"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updateReadmeMutation.isPending}
      isLoading={updateReadmeMutation.isPending}
    />
  )
}
