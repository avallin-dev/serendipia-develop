import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Combobox } from '@/app/components/Combobox'
import ModalWrapper from '@/app/components/ModalWrapper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { useRegistrarVentaProductoMutation } from '@/app/services/mutations/venta_producto'
import { usePartners } from '@/app/services/queries/partner'

const ventaSchema = z.object({
  socioId: z.string().optional().nullable(),
  cantidad: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(1, 'Mínimo 1')
    .refine((val) => val > 0, 'Debe ser mayor a 0'),
  total: z
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'Debe ser mayor o igual a 0'),
})

export default function ModalVentaProducto({ open, onClose, producto }) {
  const { partners } = usePartners()
  const registrarVenta = useRegistrarVentaProductoMutation()

  const partnerData = useMemo(
    () =>
      partners.map((e) => ({
        value: e.idSocio.toString(),
        label: `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''}`,
      })),
    [partners],
  )

  const form = useForm({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      socioId: null,
      cantidad: 1,
      total: producto?.precio || 0,
    },
  })

  // // Actualiza el total cuando cambia la cantidad
  // const handleCantidadChange = (e) => {
  //   const value = Math.max(1, Math.min(producto.cantidad, Number(e.target.value)))
  //   form.setValue('cantidad', value)
  //   form.setValue('total', value * producto.precio)
  // }

  // Permite editar el total manualmente
  // const handleTotalChange = (e) => form.setValue('total', Number(e.target.value))

  const handleSubmit = async (values) => {
    try {
      await registrarVenta.mutateAsync({
        productoId: producto.id,
        socioId: values.socioId ? Number(values.socioId) : null,
        cantidad: values.cantidad,
        total: values.total,
      })
      toast.success('Venta registrada correctamente')
      onClose()
    } catch (e) {
      toast.error('Error al registrar la venta')
    }
  }

  if (!producto) return null

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Registrar venta"
      actionLabel="Confirmar venta"
      onSubmit={form.handleSubmit(handleSubmit)}
      disabled={registrarVenta.isPending}
      isLoading={registrarVenta.isPending}
      body={
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            {JSON.stringify(form.formState.errors)}
            <div>
              <label className="block text-sm font-medium">Producto</label>
              <div className="rounded border bg-gray-50 p-2">
                <div>
                  {producto.nombre} (SKU: {producto.sku})
                </div>
                <div>Precio: ${producto.precio}</div>
                <div>Stock: {producto.cantidad}</div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="socioId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Socio (opcional)</FormLabel>
                  <FormControl>
                    <Combobox
                      data={partnerData || []}
                      placeholder="Nombre del socio"
                      onChange={field.onChange}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="cantidad"
              control={form.control}
              defaultValue={1}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={producto.cantidad}
                      value={field.value}
                      onChange={(event) => field.onChange(+event.target.value)}
                      disabled={registrarVenta.isPending}
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="total"
              control={form.control}
              defaultValue={producto?.precio || 0}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value}
                      onChange={(event) => field.onChange(+event.target.value)}
                      disabled={registrarVenta.isPending}
                    />
                  </FormControl>
                  <div className="h-4">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      }
    />
  )
}
