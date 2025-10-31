type UserLogin = {
  username: string
  password: string
}

type UserProfile = {
  username: string
  name: string
  last_name: string
  email: string
  phone: string
}

type User = {
  username: string
  password: string
}

export type AdminUserProfile = {
  idUsuario: number
  Usuario?: string | null
  Password?: string | null
  Telefono?: string | null
  idRol: number
  fechaCreacion?: Date | null
  rol?: {
    nombre?: string | null
  } | null
}
