import * as z from 'zod'

export const readmeSchema = z.object({
  title: z.string({
    required_error: 'Requerido',
  }),
  comment: z
    .string({
      required_error: 'Requerido',
    })
    .optional(),
  file: z.any().optional(),
  videoURL: z.string().url({ message: 'Formato invalido' }).optional().or(z.literal('')),
})

export const updateReadmeSchema = readmeSchema.partial()
export type readmeSchemaType = z.infer<typeof readmeSchema>
export type updateReadmeType = z.infer<typeof updateReadmeSchema>
