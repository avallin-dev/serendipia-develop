import { isValidPhoneNumber } from 'react-phone-number-input'
import * as z from 'zod'

export const inSitePaymentSchema = z.object({
    Nombre: z.string().optional(),
    Paterno: z.string().optional(),
    Materno: z.string().optional(),
    DNI: z.string().optional(),
    Telefono: z
        .string()
        .refine(isValidPhoneNumber, { message: 'Número de teléfono no válido' })
        .or(z.literal('')),
    correo: z.string().email({ message: 'El formato es incorrecto' }).or(z.literal('')),
    cardNumber: z.string().min(15,{ message: 'El formato es incorrecto' }).max(18,{ message: 'El formato es incorrecto' }).or(z.literal('')),
    cardCVV: z.number({message: 'El formato es incorrecto'}).or(z.literal('')),
    cardDate: z.string({ message: 'El formato es incorrecto' }).or(z.literal('')),
    cardHolder: z.string({ message: 'El formato es incorrecto' }).or(z.literal('')),
})


export type inSitePaymentType = z.infer<typeof inSitePaymentSchema>
