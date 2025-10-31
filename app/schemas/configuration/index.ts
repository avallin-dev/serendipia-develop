import * as z from 'zod'

export const configurationSchema = z.object({
  mensajeVencimiento: z.number(),
  cantidadBaja: z.number(),
  cantidadAlta: z.number(),
  cantidadActual: z.number(),
  formularyTitle: z.string(),
  instrucciones: z.string().optional(),
})
export const updateConfigurationSchema = configurationSchema.partial()

export type updateConfigType = z.infer<typeof updateConfigurationSchema>
export type configSchmaType = z.infer<typeof configurationSchema>
