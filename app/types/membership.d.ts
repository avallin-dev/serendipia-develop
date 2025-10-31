// import { sociomembresia_pago } from '@prisma/client'

export type MembershipPaymentType = {
  id: number
  observacion: string | null
  folio: number | null
  idSocioMembresia: number | null
  fecha: Date | null
  idEstado: number | null
  idUsuarioCreo: number | null
  importe: Decimal | null
  name: string
  estadoMembresia: $Enums.sociomembresia_estadoMembresia | null
}
