export type PilateType = {
  title: string
  id: number
  idSocio: number | null
  createdAt: Date
  updatedAt: Date
  start: Date
  end: Date
  fap: 'A' | 'P' | 'F' | undefined
}
