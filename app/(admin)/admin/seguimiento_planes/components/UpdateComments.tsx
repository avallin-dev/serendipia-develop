'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Form, FormControl, FormField, FormMessage, FormItem } from '@/app/components/ui/form'
import { Textarea } from '@/app/components/ui/textarea'
import { useUpdatePlanComment } from '@/app/services/mutations/plan'

type EditCommentMembershipProps = {
  onClose: () => void
  open: boolean
  comments?: string
  idPlan?: number | null
}

const commentSchema = z.object({
  comments: z.string().optional(),
})
export type commentSchmaType = z.infer<typeof commentSchema>

export default function UpdatePlan({
  onClose,
  open,
  comments,
  idPlan,
}: EditCommentMembershipProps) {
  const queryClient = useQueryClient()
  const updatePlanCommentMutation = useUpdatePlanComment()
  const form = useForm<commentSchmaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comments: comments || '',
    },
  })

  async function onSubmit(values: commentSchmaType) {
    updatePlanCommentMutation.mutate(
      { comments: values.comments || '', id: idPlan! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['seguimiento_planes'],
          })
          toast.success('Comentario editado exitosamente')
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
        <div className="py-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <Textarea {...field}></Textarea>
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
      title="Editar comentario"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updatePlanCommentMutation.isPending}
      isLoading={updatePlanCommentMutation.isPending}
    />
  )
}
