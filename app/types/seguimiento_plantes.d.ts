export type SeguimientoPlanesType = {
  nombreSocio: string | null
  observaciones: string | null
  condicionMedica: string | null
  nivel: $Enums.socio_nivel | null
  profesor: string
  fechaInicio: Date | null
  fechaFin: Date | null
  semanas: number
  dias: number
  shouldChangePlan: boolean
  type_of_training: $Enums.type_of_training
  comments: string | null
  idPlan: number | null
  state: $Enums.state_of_training | null
  progreso: number
  nombrePlan: string
}
