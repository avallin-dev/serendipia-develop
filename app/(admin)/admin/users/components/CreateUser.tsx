'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import PhoneInput from '@/app/components/phone-input'
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
import { usuarioSchema, usuarioSchmaType } from '@/app/schemas/admin-user'
import { useCreateUser } from '@/app/services/mutations/user'
import { useRoles } from '@/app/services/queries/rol'

type ModalCreateMembershipProps = {
  onClose: () => void
  open: boolean
}

export default function ModalCreateUser({ onClose, open }: ModalCreateMembershipProps) {
  const queryClient = useQueryClient()
  const createUserMutation = useCreateUser()
  const { roles } = useRoles()
  const form = useForm<usuarioSchmaType>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      Usuario: '',
      Password: '',
      rol: '',
      Telefono: '',
    },
  })

  async function onSubmit(values: usuarioSchmaType) {
    createUserMutation.mutate(
      { data: values },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['user'],
          })
          toast.success('Plan creado exitosamente')
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
              name="Usuario"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Usuario</FormLabel>
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
              name="Password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
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
              name="rol"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Selecciona rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-full">
                        <SelectValue placeholder="Nombre del rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      {roles &&
                        roles?.map((partner) => (
                          <SelectItem
                            key={`partner-${partner.id}`}
                            value={partner.id.toString()}
                            className="cursor-pointer"
                          >
                            {partner.nombre}
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
              name="Telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} country="ar" />
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
      title="Crear usuario"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={createUserMutation.isPending}
      isLoading={createUserMutation.isPending}
    />
  )
}
