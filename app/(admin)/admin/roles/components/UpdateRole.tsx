'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { CommandGroup } from '@/app/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import modulesAdmitted from '@/app/constants/modules'
import { roleSchmaType, updateRoleSchema } from '@/app/schemas/role'
import { useUpdateRole } from '@/app/services/mutations/role'
import { useModules } from '@/app/services/queries/rol'
import { RoleType } from '@/app/types/role'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/multi-select'

type ModalCreateUserProps = {
  onClose: () => void
  open: boolean
  role?: RoleType
}

export default function UpdateUser({ onClose, open, role }: ModalCreateUserProps) {
  const queryClient = useQueryClient()
  const updateRoleMutation = useUpdateRole()
  const { modules } = useModules()
  const form = useForm<roleSchmaType>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      nombre: role?.nombre ?? '',
      modules: role?.rol_modulo ? role?.rol_modulo.map((e) => e.cmodulo.id.toString()) : [],
    },
  })

  async function onSubmit(values: roleSchmaType) {
    const id = role?.id
    updateRoleMutation.mutate(
      { data: { ...values }, id: id! },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ['role'],
          })
          toast.success('Role editado exitosamente')
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
              name="nombre"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Nombre</FormLabel>
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
              name="modules"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Selecciona rol</FormLabel>
                  <MultiSelector
                    onValuesChange={field.onChange}
                    values={Array.isArray(field.value) ? field.value : []}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <CommandGroup>
                        <MultiSelectorList>
                          {modules.length
                            ? modules.map((moduleItem) => {
                                if (!modulesAdmitted.includes(moduleItem.nombre!)) return
                                return (
                                  <MultiSelectorItem
                                    key={`moduleItem-${moduleItem.id}`}
                                    value={moduleItem.id.toString()}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span>{moduleItem.nombre}</span>
                                    </div>
                                  </MultiSelectorItem>
                                )
                              })
                            : null}
                        </MultiSelectorList>
                      </CommandGroup>
                    </MultiSelectorContent>
                  </MultiSelector>
                  <div className="h-4">
                    <div className="h-4">
                      <FormMessage className="mt-1 text-xs tracking-wide" />
                    </div>
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
      title="Editar rol"
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Editar"
      disabled={updateRoleMutation.isPending}
      isLoading={updateRoleMutation.isPending}
    />
  )
}
