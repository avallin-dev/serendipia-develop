import * as z from 'zod'

export const partnerLoginSchema = z.object({
  dni: z.string({
    required_error: 'El dni es requerido',
  }),
})

export type partnerLoginType = z.infer<typeof partnerLoginSchema>
