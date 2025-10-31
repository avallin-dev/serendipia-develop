import { isValidPhoneNumber } from 'react-phone-number-input'
import * as z from 'zod'

export const partnerchema = z.object({
  Nombre: z.string().optional(),
  Paterno: z.string().optional(),
  Materno: z.string().optional(),
  DNI: z.string().optional(),
  Telefono: z
    .string()
    .refine(isValidPhoneNumber, { message: 'Número de teléfono no válido' })
    .or(z.literal('')),
  Observaciones: z.string().optional(),
  clave: z.string().optional(),
  nivel: z.enum(['AVANZADO', 'INTERMEDIO', 'INICIAL']).optional(),
  fechaNacimiento: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date())
    .optional(),
  correo: z.string().email({ message: 'El formato es incorrecto' }).or(z.literal('')),
  condicionMedica: z.string().optional(),
  authorization: z.number().optional(),
})

export const updatePartnerSchema = partnerchema.partial()

export type partnerType = z.infer<typeof partnerchema>
export type updateSampleType = z.infer<typeof updatePartnerSchema>
