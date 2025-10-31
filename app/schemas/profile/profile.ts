import * as z from 'zod'

export const userProfileSchema = z.object({
  name: z.string({
    required_error: 'La nombre es requerido',
  }),
  last_name: z.string({
    required_error: 'El apellido es requerido',
  }),
  email: z.string({
    required_error: 'La correo es requerido',
  }),
  phone: z.string({
    required_error: 'El teléfono es requerido',
  }),
})

export type userProfileType = z.infer<typeof userProfileSchema>
