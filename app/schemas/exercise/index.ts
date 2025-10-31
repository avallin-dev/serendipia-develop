import * as z from 'zod'

export const exerciseSchema = z.object({
  nombreEj: z.string({ required_error: 'Requerido' }),
  linkEj: z.string().url({ message: 'Formato invalido' }).optional().or(z.literal('')),
  idCategoria: z.string({ required_error: 'Requerido' }),
  Comentario: z.string().optional(),
})

export type exerciseSchmaType = z.infer<typeof exerciseSchema>
