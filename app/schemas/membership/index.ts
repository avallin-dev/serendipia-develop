import * as z from 'zod'

export const membershipSchema = z.object({
  Nombre: z.string(),
  Precio: z.number().multipleOf(0.01),
  horaInicio: z.string().optional(),
  horaFinal: z.string().optional(),
  idTipoMembresia: z.string(),
  semanas: z.number().optional(),
  dias: z.number().optional(),
  meses: z.number().optional(),
})

export type membershipSchmaType = z.infer<typeof membershipSchema>
