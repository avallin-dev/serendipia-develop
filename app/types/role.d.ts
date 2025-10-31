export type RoleModuleType = { cmodulo: { nombre: string | null; id: number } }

export type RoleType = {
  id: number
  nombre: string
  FechaCreacion: Date
  idEstado: number
  estado?: {
    Estado?: string | null
  } | null
  rol_modulo: RoleModuleType[]
}
