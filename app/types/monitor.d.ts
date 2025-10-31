import { plan } from '@prisma/client'

export interface Membresia {
  idMembresia: number
  Nombre: string
  idEstado: number
}

export interface SocioMembresia {
  idMembresia: number
  estadoMembresia: string
  Vencimiento: string
  membresia: Membresia
}

export interface Plan {
  idPlan: number
  NombrePlan: string
}

export interface Socio {
  idSocio: number | null
  Nombre: string
  Paterno: string
  Materno: string
  DNI: string
  Telefono: string
  correo: string
  fechaNacimiento: string
  idPlan: number
  plan: plan | undefined
  image_profile: string
}

export type MonitorType = {
  idVisita: number
  idSocio: number | null
  fechaCreacion: Date | null
  horaFinalizacion: Date | null
  socio: Socio
  name: string
}

export interface MembresiaUpdate {
  idMembresia: number;
  Nombre: string | null;
  idEstado: number | null;
  fechaCreacion: Date | null;
  Precio: Decimal | null;
  idUsuarioCreo: number | null;
  meses: number | null;
  dias: number | null;
  horaInicio: Date | null;
  horaFinal: Date | null;
  idTipoMembresia: number | null;
  semanas: number | null;
  dias: 1
}