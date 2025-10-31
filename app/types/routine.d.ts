import { categoria_ej, ejercicios, partner_comment, plan } from '@prisma/client'

export type RoutineType = {
  idRutina: number
  idPlan: number
  idEjercicio: number
  dia: number | null
  nroEjercicio: string | null
  repeticionS1: string | null
  repeticionS2: string | null
  repeticionS3: string | null
  repeticionS4: string | null
  repeticionS5: string | null
  repeticionS6: string | null
  repeticionS7: string | null
  repeticionS8: string | null
  repeticionS9: string | null
  comentarioS1: string | null
  comentarioS2: string | null
  comentarioS3: string | null
  comentarioS4: string | null
  comentarioS5: string | null
  comentarioS6: string | null
  comentarioS7: string | null
  comentarioS8: string | null
  comentarioS9: string | null
  ejercicios: ejercicios
  plan: plan
}

type ExercisesWithCategory = ejercicios & {
  categoria_ej: categoria_ej
}
export type RoutineWithExerciseType = {
  idRutina: number
  idPlan: number
  idEjercicio: number
  dia: number | null
  nroEjercicio: string | null
  repeticionS1: string | null
  repeticionS2: string | null
  repeticionS3: string | null
  repeticionS4: string | null
  repeticionS5: string | null
  repeticionS6: string | null
  repeticionS7: string | null
  repeticionS8: string | null
  repeticionS9: string | null
  repeticionS10: string | null
  repeticionS11: string | null
  repeticionS12: string | null
  comentarioS1: string | null
  comentarioS2: string | null
  comentarioS3: string | null
  comentarioS4: string | null
  comentarioS5: string | null
  comentarioS6: string | null
  comentarioS7: string | null
  comentarioS8: string | null
  comentarioS9: string | null
  comentarioS10: string | null
  comentarioS11: string | null
  comentarioS12: string | null
  ejercicios: ExercisesWithCategory
  detalles: rutina_ejercicio_detalle[]
  has_details: boolean
}

export type RoutineByWeekType = {
  idRutina: number
  idPlan: number
  idEjercicio: number
  dia: number | null
  nroEjercicio: string | null
  repeticionS1: string | null
  repeticionS2: string | null
  repeticionS3: string | null
  repeticionS4: string | null
  repeticionS5: string | null
  repeticionS6: string | null
  repeticionS7: string | null
  repeticionS8: string | null
  repeticionS9: string | null
  repeticionS10: string | null
  repeticionS11: string | null
  repeticionS12: string | null
  comentarioS1: string | null
  comentarioS2: string | null
  comentarioS3: string | null
  comentarioS4: string | null
  comentarioS5: string | null
  comentarioS6: string | null
  comentarioS7: string | null
  comentarioS8: string | null
  comentarioS9: string | null
  comentarioS10: string | null
  comentarioS11: string | null
  comentarioS12: string | null
  ejercicios: ExercisesWithCategory
  partner_comment: partner_comment | null
}
