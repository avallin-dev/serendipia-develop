'use client'

import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import es from 'date-fns/locale/es'
import { Bar } from 'react-chartjs-2'

import { useHistorialCheckins } from '@/app/services/queries/chart'

export function HistorialCheckins() {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i))
  const labels = months.map((date) => format(date, 'MMM yyyy'))
  const from = format(startOfMonth(months[0]), "yyyy-MM-dd'T'00:00:00.000'Z'")
  const to = format(endOfMonth(months[5]), "yyyy-MM-dd'T'23:59:59.999'Z'")
  const { data, isLoading } = useHistorialCheckins({ from, to })

  // Agrupar checkins por mes
  const checkinsPorMes = months.map((date) => {
    const mes = date.getMonth()
    const anio = date.getFullYear()
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.filter((socio: any) => {
        if (!socio.fechamod) return false
        const d = new Date(socio.fechamod)
        return d.getMonth() === mes && d.getFullYear() === anio
      }).length || 0
    )
  })

  return (
    <div>
      <div className="mb-2 flex items-center space-x-2">
        <div className="flex gap-8">
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-500">
              Check-ins en {format(months[5], 'MMMM', { locale: es })} de{' '}
              {format(months[5], 'yyyy', { locale: es })}
            </span>
            <span className="text-lg font-bold">{checkinsPorMes[5]}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-500">Últimos {months.length} meses</span>
            <span className="text-lg font-bold">
              {checkinsPorMes.reduce((acc, curr) => acc + curr, 0)}
            </span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">Cargando...</div>
        ) : (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: 'Checkins',
                  data: checkinsPorMes,
                  backgroundColor: 'rgb(248 113 113)',
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        )}
      </div>
    </div>
  )
}
