import * as z from 'zod'

export const categorySchema = z.object({
  nombreCat: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
})
export const updateCategorySchema = categorySchema.partial()

export type updateCategoryType = z.infer<typeof updateCategorySchema>
export type categorySchmaType = z.infer<typeof categorySchema>
