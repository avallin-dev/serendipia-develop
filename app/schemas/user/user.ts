import * as z from 'zod'

export const userLoginSchema = z.object({
  username: z.string({
    required_error: 'El nombre es requerido',
  }),
  password: z.string({
    required_error: 'La contraseña es requerida',
  }),
})

export type userLoginType = z.infer<typeof userLoginSchema>
