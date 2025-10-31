import * as z from 'zod'

export const pilateSchema = z
  .object({
    classType: z.enum(['disponible', 'recuperativa', 'prueba']),
    idSocio: z.string().optional(),
    title: z.string().optional(),
    start: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date()),
    end: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date()),
  })
  .refine(
    (data) => {
      if (['disponible', 'recuperativa'].includes(data.classType)) {
        return !!data.idSocio
      }
      if (data.classType === 'prueba') {
        return !!data.title
      }
      return true
    },
    {
      message: 'Campo requerido',
      path: ['idSocio'],
    }
  )

export const pilateChangeStatusSchema = z.object({
  fap: z.enum(['F', 'A', 'P'], {
    errorMap: () => ({ message: "El valor debe ser 'F', 'A' o 'P'." }),
  }),
})

export const pilateClassSchema = z.object({
  day: z.string().min(1, 'El día es obligatorio'),
  time: z.string().min(1, 'La hora es obligatoria'),
})

export const pilateFullSchema2 = z.object({
  idSocio: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
  sociomembresiaPilates: z
    .array(pilateClassSchema)
    .min(1, 'Debe seleccionar al menos una clase')
    .max(5, 'No puede seleccionar más de 5 clases'),
})

export const pilateFullSchema = z.object({
  idSocio: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
  class1Day: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
  class1Time: z.string({ required_error: 'Requerido' }).min(1, 'Requerido'),
  class2Day: z.string(),
  class2Time: z.string(),
  class3Day: z.string(),
  class3Time: z.string(),
  class4Day: z.string(),
  class4Time: z.string(),
  class5Day: z.string(),
  class5Time: z.string(),
})

export type pilateSchmaType = z.infer<typeof pilateSchema>
export type pilateChangeStatusSchmaType = z.infer<typeof pilateChangeStatusSchema>
export type pilateFullSchmaType = z.infer<typeof pilateFullSchema>
export type pilateFullSchmaType2 = z.infer<typeof pilateFullSchema2>
