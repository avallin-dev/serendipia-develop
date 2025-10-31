'use client'
import { differenceInMinutes, format, isAfter, isBefore } from 'date-fns'
import es from 'date-fns/locale/es'
import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'

import AlumnChart from '@/app/charts/alumn-chart'
import { useConcurrencia, VisitaExport } from '@/app/services/queries/chart'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface ConcurrenciaChartProps {
  from: string
  to: string
}

export function ConcurrenciaChart({ from, to }: ConcurrenciaChartProps) {
  const [internalFrom, setInternalFrom] = useState(from)
  const [internalTo, setInternalTo] = useState(to)
  const [selectedDay, setSelectedDay] = useState(format(new Date(from), 'yyyy-MM-dd'))
  const { concurrencia, visitasExport, isLoading } = useConcurrencia({
    from: internalFrom,
    to: internalTo,
  })
  const [data, setData] = useState<Record<string, Record<number, number>> | undefined>(undefined)
  const horas = Array.from({ length: 24 }, (_, i) => i)

  // Sincroniza el estado interno si cambian las props
  useEffect(() => {
    setInternalFrom(from)
    setInternalTo(to)
    setSelectedDay(format(new Date(from), 'yyyy-MM-dd'))
  }, [from, to])

  useEffect(() => {
    if (concurrencia && Object.keys(concurrencia).length > 0) {
      setData(concurrencia as Record<string, Record<number, number>>)
      const dias = Object.keys(concurrencia)
      if (dias.length > 0) setSelectedDay(dias[0])
    }
  }, [concurrencia])

  function handleExport() {
    if (!visitasExport) return
    const sheets = visitasExport.map((v: VisitaExport) => ({
      'Nombre del socio': v.nombre,
      Membresía: v.membresia,
      'Fecha de creación': v.fechaCreacion
        ? format(new Date(formatTrulyUTC(v.fechaCreacion)), 'yyyy-MM-dd HH:mm')
        : '',
      'Hora de finalización': v.horaFinalizacion
        ? format(new Date(v.horaFinalizacion), 'yyyy-MM-dd HH:mm')
        : '',
    }))
    const ws = XLSX.utils.json_to_sheet(sheets)
    const colNames = Object.keys(sheets[0] || {})
    ws['!cols'] = colNames.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...sheets.map((row) => (row[col] ? String(row[col]).length : 0)),
      )
      return { wch: maxLen + 2 }
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Visitas')
    XLSX.writeFile(wb, 'visitas.xlsx')
  }

  const dias = data
    ? Object.keys(data).filter((dia) => {
      const date = new Date(dia)
      return (
        (isAfter(date, new Date(internalFrom)) ||
          date.toDateString() === new Date(internalFrom).toDateString()) &&
        (isBefore(date, new Date(internalTo)) ||
          date.toDateString() === new Date(internalTo).toDateString())
      )
    })
    : []

  // Nuevo useEffect para mantener selectedDay válido
  useEffect(() => {
    if (dias.length > 0) {
      if (!dias.includes(selectedDay)) {
        setSelectedDay(dias[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias.join(','), selectedDay])

  const concurrenciaPorHora = data ? horas.map((h) => data[selectedDay]?.[h] || 0) : []

  // Calcular tiempo promedio en sala para Con plan y Sin plan
  const tiempos = { conPlan: [], sinPlan: [] } as { conPlan: number[]; sinPlan: number[] }
  if (visitasExport) {
    visitasExport.forEach((v) => {
      if (v.fechaCreacion && v.horaFinalizacion) {
        const minutos = differenceInMinutes(
          new Date(v.horaFinalizacion),
          new Date(formatTrulyUTC(v.fechaCreacion)),
        )
        if (v.membresia && v.membresia.trim() !== '') {
          tiempos.conPlan.push(minutos)
        } else {
          tiempos.sinPlan.push(minutos)
        }
      }
    })
  }
  const promedio = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
  const promedioConPlan = promedio(tiempos.conPlan)
  const promedioSinPlan = promedio(tiempos.sinPlan)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Alumnos</h2>
        <Button
          className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
          onClick={handleExport}
          title="Exportar a Excel"
          variant="secondary"
        >
          <FiDownload />
        </Button>
      </div>
      <div className="mb-2 flex items-center space-x-2">
        <span className="capitalize">
          {format(new Date(internalFrom), 'dd/MM/yyyy', { locale: es })} -{' '}
          {format(new Date(internalTo), 'dd/MM/yyyy', { locale: es })}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        {dias.map((dia) => (
          <button
            key={dia}
            className={cn(
              'text-lg capitalize',
              selectedDay === dia ? 'font-bold underline' : 'text-gray-500',
            )}
            onClick={() => setSelectedDay(dia)}
            disabled={isLoading}
          >
            {format(new Date(dia), 'EEEE dd/MM', { locale: es })}
          </button>
        ))}
      </div>
      <div>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">Cargando...</div>
        ) : (
          // <Bar
          //   data={{
          //     labels: horas.map((h) => `${h}:00`),
          //     datasets: [
          //       {
          //         label: 'Concurrencia',
          //         data: concurrenciaPorHora,
          //         backgroundColor: (context: ScriptableContext<'bar'>) => {
          //           const ctx = context.chart.ctx
          //           const gradient = ctx.createLinearGradient(0, 0, 0, 200)
          //           gradient.addColorStop(0, 'rgba(14,1,117,255)')
          //           gradient.addColorStop(0.33, 'rgba(165,33,113,255)')
          //           gradient.addColorStop(0.66, 'rgba(234,115,58,255)')
          //           gradient.addColorStop(1, 'rgba(237,249,26,255)')
          //           return gradient
          //         },
          //       },
          //     ],
          //   }}
          //   options={{
          //     maintainAspectRatio: false,
          //     responsive: true,
          //     plugins: {
          //       legend: {
          //         position: 'bottom',
          //       },
          //     },
          //   }}
          // />
          <AlumnChart barData={concurrenciaPorHora} horas={horas} />
        )}

      </div>
      {/* Tabla de tiempo promedio en sala */}
      <div className="mx-auto mt-6 max-w-xs">
        <h3 className="mb-2 font-semibold">Tiempo promedio en sala</h3>
        <table className="w-full border text-base">
          <tbody>
          <tr>
            <td className="border px-2 py-1">Con plan</td>
            <td className="border px-2 py-1 text-right">{promedioConPlan} min</td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Sin plan</td>
            <td className="border px-2 py-1 text-right">{promedioSinPlan} min</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
