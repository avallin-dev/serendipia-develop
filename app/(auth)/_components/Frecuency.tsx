import { getSetup } from '@/app/actions'

export const dynamic = 'force-dynamic'
export default async function Frecuency() {
  const concurrence = await getSetup()

  let bgColor: string = ''
  let tConcurrence: string = ''
  switch (concurrence) {
    case 'BAJA':
      bgColor = 'bg-green-600'
      tConcurrence = 'Frecuencia cardíaca SERENDIPIA 55 latidos por minuto'
      break
    case 'NORMAL':
      bgColor = 'bg-yellow-500'
      tConcurrence = 'Frecuencia cardíaca SERENDIPIA 130 latidos por minuto'
      break
    case 'ALTA':
      bgColor = 'bg-red-500'
      tConcurrence = 'Frecuencia cardíaca SERENDIPIA 180 latidos por minuto'
      break
    default:
      break
  }

  if (!concurrence) return null

  return (
    <div className={`rounded border border-white p-2 text-center ${bgColor}`}>{tConcurrence}</div>
  )
}
