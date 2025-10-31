import { plan, socio } from '@prisma/client'

type PartnerLogin = {
  dni: string
}

type GrupoInfo = {
  idSocio: number
  Nombre: string | null
  Paterno: string | null
}

export type PartnerRoutine = {
  idSocio: number
  idPlan: number | null
  DNI: string | null
  Nombre: string | null
  Paterno: string | null
  Telefono: string | null
  Observaciones: string | null
  plan: plan[] | null
  grupo?: GrupoInfo | null
  miembros?: socio[] | null
}
