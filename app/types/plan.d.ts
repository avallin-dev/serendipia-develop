import { $Enums } from '@prisma/client'
export type PlanType = {
  idPlan: number
  NombrePlan: string
  fechaCreacion?: Date | null
  fechamod?: Date | null
  idSocio?: number | null
  idUsuario?: number | null
  idLink?: number | null
  dias?: number | null
  semanas?: number | null
  diaactual?: number | null
  semanaactual?: number | null
  socio?: {
    Nombre?: string | null
    Paterno?: string | null
    idPlan: number | null
  } | null
  usuario?: {
    idUsuario: number
    Nombre?: string | null
    idEstado?: number | null
  } | null
  type_of_training?: $Enums.type_of_training | null
  teacher_comments?: string | null
}
