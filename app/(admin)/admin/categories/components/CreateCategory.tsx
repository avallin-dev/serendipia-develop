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
import { categorySchema, categorySchmaType } from '@/app/schemas/category'
import { useCreateCategory } from '@/app/services/mutations/category'

type CreateRoleProps = {
  onClose: () => void
  open: boolean
}

export default function CreateRole({ onClose, open }: CreateRoleProps) {
  const queryClient = useQueryClient()
  const createCategoryMutation = useCreateCategory()
  const form = useForm<categorySchmaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nombreCat: '',
    },
  })

  async function onSubmit(values: categorySchmaType) {
    createCategoryMutation.mutate(
      { data: values },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['category'],
          })
          toast.success('Categoria creada exitosamente')
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
      title="Crear categoria"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={createCategoryMutation.isPending}
      isLoading={createCategoryMutation.isPending}
    />
  )
}
