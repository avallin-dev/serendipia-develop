import { z } from 'zod'

export const ventaProductoSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  cantidad: z.coerce.number().min(0, 'La cantidad debe ser 0 o mayor'),
  cantidadMin: z.coerce.number().min(0, 'La cantidad mínima debe ser 0 o mayor'),
  categoriaId: z
    .union([z.number().int().min(1, 'Selecciona una categoría'), z.undefined()])
    .refine((val) => val !== undefined, { message: 'Selecciona una categoría' }),
  imagen: z.any().optional(),
})

export type VentaProductoSchemaType = z.infer<typeof ventaProductoSchema>
