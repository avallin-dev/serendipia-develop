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
import { exerciseSchmaType, exerciseSchema } from '@/app/schemas/exercise'
import { useUpdateExercise } from '@/app/services/mutations/exercise'
import { useCategory } from '@/app/services/queries/category'
import { ExerciseType } from '@/app/types/exercise'

type ModalCreateMembershipProps = {
  onClose: () => void
  open: boolean
  exercise?: ExerciseType
}

export default function UpdatePlan({ onClose, open, exercise }: ModalCreateMembershipProps) {
  const queryClient = useQueryClient()
  const updateExerciseMutation = useUpdateExercise()
  const { categories } = useCategory()
  const form = useForm<exerciseSchmaType>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      nombreEj: exercise?.nombreEj ?? '',
      linkEj: exercise?.linkEj ?? '',
      idCategoria: exercise?.idCategoria?.toString() ?? '',
      Comentario: exercise?.Comentario ?? '',
    },
  })

  async function onSubmit(values: exerciseSchmaType) {
    const id = exercise?.idEjercicio
    updateExerciseMutation.mutate(
      { data: values, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['exercise'],
          })
          toast.success('Ejericio creado exitosamente')
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
              name="nombreEj"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nombre del ejercicio</FormLabel>
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
              name="idCategoria"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Selecciona categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Nombre de la categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      {categories &&
                        categories?.map((category) => (
                          <SelectItem
                            key={`category-${category.idCategoria}`}
                            value={category.idCategoria.toString()}
                            className="cursor-pointer"
                          >
                            {category.nombreCat}
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
              name="linkEj"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Enlace</FormLabel>
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
              name="Comentario"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Comentario</FormLabel>
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
      title="Editar ejercicio"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updateExerciseMutation.isPending}
      isLoading={updateExerciseMutation.isPending}
    />
  )
}
