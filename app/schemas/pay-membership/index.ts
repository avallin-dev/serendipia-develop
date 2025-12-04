import * as z from 'zod'

export const payMembershipSchema = z.object({
  observacion: z.string().optional(),
  importe: z.number({ required_error: 'Campo requerido' }).multipleOf(0.01).gt(0, {
    message: 'El importe debe ser mayor que 0',
  }).max(999999999, {message: 'El importe debe ser menor que 999999999.00'}),
})

export const updatePayMembershipSchema = payMembershipSchema.partial()

export type partnerMembershipType = z.infer<typeof payMembershipSchema>
