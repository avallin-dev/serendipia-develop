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
import { readmeSchema, readmeSchemaType } from '@/app/schemas/readme'
import { useCreateReadme } from '@/app/services/mutations/readme'
import { FileUploader } from '@/components/file-uploader'

type ModalCreateMembershipProps = {
  onClose: () => void
  open: boolean
}

export default function CreateReadme({ onClose, open }: ModalCreateMembershipProps) {
  const queryClient = useQueryClient()
  const createReadmeMutation = useCreateReadme()
  const form = useForm<readmeSchemaType>({
    resolver: zodResolver(readmeSchema),
    defaultValues: {
      title: '',
      comment: '',
      file: undefined,
      videoURL: '',
    },
  })

  async function onSubmit(values: readmeSchemaType) {
    const { title, comment, file, videoURL } = values
    const formData = new FormData()
    formData.append('title', title ?? '')
    formData.append('comment', comment ?? '')
    values.file && formData.append('file', file[0])
    formData.append('videoURL', videoURL ?? '')
    createReadmeMutation.mutate(
      { data: formData },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['readme'],
          })
          toast.success('Readme creado exitosamente')
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
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Titulo</FormLabel>
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
              name="comment"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Comentario</FormLabel>
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
              name="videoURL"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" className="rounded-full" />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Archivo</FormLabel>
                  <FormControl>
                    <FileUploader
                      maxFiles={1}
                      value={field.value}
                      onValueChange={field.onChange}
                      accept={{
                        'image/*': [],
                        'application/pdf': [],
                        'application/octet-stream': [],
                        'application/zip': [],
                      }}
                      maxSize={8 * 1024 * 1024}
                      className="h-20"
                      adviced={false}
                    />
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
      title="Crear readme"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={createReadmeMutation.isPending}
      isLoading={createReadmeMutation.isPending}
    />
  )
}
