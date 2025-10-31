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
import { updateCategoryType, updateCategorySchema } from '@/app/schemas/category'
import { useUpdateCategory } from '@/app/services/mutations/category'
import { CategoryType } from '@/app/types/category'

type ModalCreateUserProps = {
  onClose: () => void
  open: boolean
  category?: CategoryType
}

export default function UpdateUser({ onClose, open, category }: ModalCreateUserProps) {
  const queryClient = useQueryClient()
  const updateCategoryMutation = useUpdateCategory()
  const form = useForm<updateCategoryType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      nombreCat: category?.nombreCat ?? '',
    },
  })

  async function onSubmit(values: updateCategoryType) {
    const id = category?.idCategoria
    updateCategoryMutation.mutate(
      { data: { ...values }, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['category'],
          })
          toast.success('Category editado exitosamente')
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
              name="nombreCat"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nombre de categoria</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="rounded-full" />
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
      title="Editar categoria"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updateCategoryMutation.isPending}
      isLoading={updateCategoryMutation.isPending}
    />
  )
}
