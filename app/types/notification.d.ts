export type NotificationType = {
  id: number
  title: string
  seen: boolean
  type: $Enums.notification_type
  refLink: string | null
  createdAt: Date
  updatedAt: Date
  details: string | null
  externalLink: string | null
  general: boolean
  userId: number | null
  user: {
    DNI: string | null
    Nombre: string | null
    Paterno: string | null
  } | null
}
