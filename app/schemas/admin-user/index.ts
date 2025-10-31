import { isValidPhoneNumber } from 'react-phone-number-input'
import * as z from 'zod'

export const usuarioSchema = z.object({
  Usuario: z.string(),
  Password: z.string(),
  rol: z.string(),
  Telefono: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Número de teléfono no válido' })
    .or(z.literal('')),
})
export const updateUserSchema = usuarioSchema.partial()

export type updateUserType = z.infer<typeof updateUserSchema>
export type usuarioSchmaType = z.infer<typeof usuarioSchema>
