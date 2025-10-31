import * as z from 'zod'

export const roleSchema = z.object({
  nombre: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
  modules: z.array(z.string()),
})
export const updateRoleSchema = roleSchema.partial()

export type updateRoleType = z.infer<typeof updateRoleSchema>
export type roleSchmaType = z.infer<typeof roleSchema>
