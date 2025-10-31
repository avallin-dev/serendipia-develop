import { $Enums } from '@prisma/client'
import * as z from 'zod'

export const planSchema = z.object({
  NombrePlan: z.string().min(1, 'Este campo es requerido'),
  partnerId: z.string().optional(),
  idUsuario: z.string().optional(),
  semanas: z.number().optional(),
  dias: z.number().optional(),
  fechaCreacion: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date())
    .optional(),
  type_of_training: z.nativeEnum($Enums.type_of_training).optional(),
  teacher_comments: z.string().optional(),
})

export type planSchmaType = z.infer<typeof planSchema>
