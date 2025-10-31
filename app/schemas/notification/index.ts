import * as z from 'zod'

export const notificationchema = z
  .object({
    title: z.string({
      required_error: 'El titulo es requerido',
    }),
    type: z.string({
      required_error: 'La tipo es requerido',
    }),
    link: z.string().url({ message: 'Formato invalido' }).optional().or(z.literal('')),
    details: z.string({}).optional(),
    dni: z.string({}).optional(),
  })
  .superRefine((schema, ctx) => {
    if (schema.type !== 'general' && !schema.dni) {
      ctx.addIssue({
        message: 'El DNI es requerido',
        path: ['dni'],
        code: z.ZodIssueCode.custom,
      })
    }
  })

export type notificationType = z.infer<typeof notificationchema>
