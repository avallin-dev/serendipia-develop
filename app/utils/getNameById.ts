export function statusCode(id?: number) {
  let status: 'Activo' | 'Inactivo' | 'Eliminado' | '' = ''
  switch (id) {
    case 1:
      status = 'Activo'
      break
    case 2:
      status = 'Inactivo'
      break
    case 3:
      status = 'Eliminado'
      break

    default:
      status = ''
      break
  }

  return status
}

export function typeMembershipCode(id?: number) {
  let status: 'Mensual' | 'Semanal' | 'Dias' | '' = ''
  switch (id) {
    case 1:
      status = 'Mensual'
      break
    case 2:
      status = 'Semanal'
      break
    case 3:
      status = 'Dias'
      break

    default:
      status = ''
      break
  }

  return status
}

export function formatAmountByTypeMembership({
  typeMembership,
  months,
  weeks,
  days,
}: {
  typeMembership: number
  months: number
  weeks: number
  days: number
}) {
  switch (typeMembership) {
    case 1:
      return `${months} ${months === 1 ? 'mes' : 'meses'}`
    case 2:
      return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
    case 3:
      return `${days} ${days === 1 ? 'dia' : 'dias'}`
    default:
      return ''
  }
}
