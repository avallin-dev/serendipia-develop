import type { socio_muestra } from '@prisma/client'

type SampleInput = {
  weight?: number
  height?: number
  porcentageFat?: number
  porcentageMass?: number
  observation?: string
  dateSample?: NativeDate | Date
}

export type Sample_Muestra = socio_muestra & {
  peso?: number
  estatura?: number
  porcentajeGrasaCorporal?: number
  porcentajeMasaMuscular?: number
}
