import * as z from 'zod'

export const partnerMembershipSchema = z.object({
  fechaInicioMembresia: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
  }, z.date()),
  Vencimiento: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
  }, z.date()),
  idMembresia: z.string().min(1, 'Este campo es requerido'),
})

export const updatePartnerSchema = partnerMembershipSchema.partial()

export type partnerMembershipType = z.infer<typeof partnerMembershipSchema>
export type updateSampleType = z.infer<typeof updatePartnerSchema>
