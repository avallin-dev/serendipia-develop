import { z } from 'zod'

export const routineSerieSchema = z.object({
  serie: z.number(),
  repeticiones: z.number().optional(),
  descanso: z.number().optional(),
  rpe: z.string().optional(),
  peso: z.number().optional(),
  comentario: z.string().optional(),
})

export const routineDetailSchema = z.object({
  semana: z.number(),
  series: z.array(routineSerieSchema),
})

export const routineSchema = z.object({
  dia: z.number(),
  nroEjercicio: z.string(),
  idEjercicio: z.string(),
  idPlan: z.string(),
  has_details: z.boolean().optional(),
  detalles: z.array(routineDetailSchema).optional(),
  repeticionS1: z.string().max(20).optional(),
  comentarioS1: z.string().max(100).optional(),
  repeticionS2: z.string().max(20).optional(),
  comentarioS2: z.string().max(100).optional(),
  repeticionS3: z.string().max(20).optional(),
  comentarioS3: z.string().max(100).optional(),
  repeticionS4: z.string().max(20).optional(),
  comentarioS4: z.string().max(100).optional(),
  repeticionS5: z.string().max(20).optional(),
  comentarioS5: z.string().max(100).optional(),
  repeticionS6: z.string().max(20).optional(),
  comentarioS6: z.string().max(100).optional(),
  repeticionS7: z.string().max(20).optional(),
  comentarioS7: z.string().max(100).optional(),
  repeticionS8: z.string().max(20).optional(),
  comentarioS8: z.string().max(100).optional(),
  repeticionS9: z.string().max(20).optional(),
  comentarioS9: z.string().max(100).optional(),
  repeticionS10: z.string().max(20).optional(),
  comentarioS10: z.string().max(100).optional(),
  repeticionS11: z.string().max(20).optional(),
  comentarioS11: z.string().max(100).optional(),
  repeticionS12: z.string().max(20).optional(),
  comentarioS12: z.string().max(100).optional(),
})

export type routineSchmaType = z.infer<typeof routineSchema>
export type routineDetailType = z.infer<typeof routineDetailSchema>
export type routineSerieType = z.infer<typeof routineSerieSchema>
