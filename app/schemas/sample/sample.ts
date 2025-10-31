import * as z from 'zod'

export const sampleSchema = z.object({
  weight: z.number().optional(),
  height: z.number().optional(),
  porcentageFat: z.number().optional(),
  porcentageMass: z.number().optional(),
  observation: z.string().optional(),
  dateSample: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date())
    .optional(),
})

export const updateSampleSchema = sampleSchema.partial()

export type sampleType = z.infer<typeof sampleSchema>
export type updateSampleType = z.infer<typeof updateSampleSchema>
