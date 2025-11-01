'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { GroupBase } from 'react-select'
import { toast } from 'sonner'

import { SelectComponent } from '@/app/components/createable-select'
import ModalWrapper from '@/app/components/ModalWrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { ventaProductoSchema, VentaProductoSchemaType } from '@/app/schemas/venta_producto'
import { useCreateVentaCategoriaMutation } from '@/app/services/mutations/venta_categoria'
import {
  useCreateVentaProductoMutation,
  useUpdateVentaProductoMutation,
} from '@/app/services/mutations/venta_producto'
import UploadImage from '@/app/(admin)/admin/venta_producto/_components/UploadImage'

interface UpdateProductoProps {
  open: boolean
  onClose: () => void
  categories: { id: number; nombre: string }[]
  initialData?: (Partial<VentaProductoSchemaType> & { id?: number }) | null
  isUpdate?: boolean
}

type Option = GroupBase<string> & {
  value: string
  label: string
}

export function UpdateVentaProducto({
                                      open,
                                      onClose,
                                      categories,
                                      initialData,
                                      isUpdate,
                                    }: UpdateProductoProps) {
  const queryClient = useQueryClient()
  const createVenta = useCreateVentaProductoMutation()
  const updateVenta = useUpdateVentaProductoMutation()
  const createCategoria = useCreateVentaCategoriaMutation()
  const form = useForm<VentaProductoSchemaType>({
    resolver: zodResolver(ventaProductoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      sku: initialData?.sku || '',
      descripcion: initialData?.descripcion || '',
      precio: initialData?.precio || 0,
      cantidad: initialData?.cantidad || 0,
      cantidadMin: initialData?.cantidadMin || 0,
      imagen: initialData?.imagen || undefined,
      categoriaId: initialData?.categoriaId || categories[0]?.id || undefined,
    },
  })

  function onSubmit(data: VentaProductoSchemaType) {
    const { nombre, sku, descripcion, precio, cantidad, cantidadMin, categoriaId, imagen } = data
    const uploadedImage = localStorage.getItem('upload-filePath')
    const formData = new FormData()
    formData.append('nombre', nombre ?? '')
    formData.append('sku', sku ?? '')
    formData.append('descripcion', descripcion ?? '')
    formData.append('precio', precio.toString())
    formData.append('cantidad', cantidad.toString())
    formData.append('cantidadMin', cantidadMin.toString())
    formData.append('categoriaId', categoriaId?.toString() ?? '')
    formData.append('imagen', uploadedImage ?? '')
    if (isUpdate && initialData?.id) {
      updateVenta.mutate(
        { id: initialData.id, data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['venta-productos'],
            })
            toast.success('Producto actualizado exitosamente')
            onClose()
          },
          onError: () => toast.error('Error al actualizar el producto'),
        },
      )
    } else {
      createVenta.mutate(
        { data: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['venta-productos'],
            })
            toast.success('Producto creado exitosamente')
            onClose()
          },
          onError: (error) => {
            console.error(error)
            toast.error('Error al crear el producto')
          },
        },
      )
    }
  }

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-2">
          <div className="grid w-full grid-cols-1 grid-rows-2 gap-4 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cantidadMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad mínima</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <SelectComponent
                      createAble={true}
                      options={
                        categories.map((cat) => ({
                          value: String(cat.id),
                          label: cat.nombre,
                        })) as Option[]
                      }
                      placeholder="Selecciona o crea categoría"
                      value={field.value ? String(field.value) : ''}
                      isLoading={createCategoria.isPending}
                      onChange={async (value) => {
                        // Si el valor existe en las opciones, simplemente lo selecciona
                        const exists = categories.find((cat) => String(cat.id) === value)
                        if (exists) {
                          field.onChange(Number(value))
                        } else if (value) {
                          try {
                            const nuevaCategoria = await createCategoria.mutateAsync({
                              nombre: value,
                            })
                            if (nuevaCategoria && nuevaCategoria.id) {
                              categories.push({
                                id: nuevaCategoria.id,
                                nombre: nuevaCategoria.nombre,
                              })
                              field.onChange(nuevaCategoria.id)
                            }
                          } catch (e) {
                            toast.error('Error al crear la categoría')
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <UploadImage />
        <FormField
          control={form.control}
          name="imagen"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel></FormLabel>
              <FormControl>
                {/*<FileUploader*/}
                {/*  maxFiles={1}*/}
                {/*  value={field.value}*/}
                {/*  onValueChange={field.onChange}*/}
                {/*  accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}*/}
                {/*  maxSize={8 * 1024 * 1024}*/}
                {/*  className="h-20"*/}
                {/*  adviced={false}*/}
                {/*/>*/}
              </FormControl>
              <div className="h-4">
                <FormMessage className="mt-1 text-xs tracking-wide" />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={isUpdate ? 'Editar producto' : 'Agregar producto'}
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel={isUpdate ? 'Actualizar' : 'Crear'}
      disabled={createVenta.isPending || updateVenta.isPending}
      isLoading={createVenta.isPending || updateVenta.isPending}
    />
  )
}
