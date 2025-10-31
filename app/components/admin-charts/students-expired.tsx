'use client'

import { Chart as ChartJS } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import { useStudentsByMembership } from '@/app/services/queries/chart'
import { Button } from '../ui/button'
import PlansByTrainerChart from '@/app/charts/plans-by-trainer-chart'

import ExpiredMonthChart from '@/app/charts/expired-month-chart'

ChartJS.register(ChartDataLabels)

const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Con plan', value: 'con_plan' },
  { label: 'Sin plan', value: 'sin_plan' },
  { label: 'Otros', value: 'otros' },
]

export default function StudentsExpired({
                                          from: fromProp,
                                          to: toProp,
                                        }: {
  from?: Date
  to?: Date
}) {
  const now = new Date()
  const from = fromProp ?? new Date(now.getFullYear(), now.getMonth(), 1)
  const to = toProp ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const [filtro, setFiltro] = useState<'todos' | 'con_plan' | 'sin_plan' | 'otros'>('todos')
  const { data: dataBar, isLoading: isLoadingBar } = useStudentsByMembership({
    from,
    to,
  })

  // Filtrar según el filtro seleccionado
  const dataFiltrada = Array.isArray(dataBar)
    ? dataBar.filter((d) => {
      if (!d || typeof d.Membresía !== 'string' || !d.Alumno) return false
      const nombre = d.Membresía.toLowerCase()
      if (filtro === 'con_plan') return nombre.includes('con plan')
      if (filtro === 'sin_plan') return nombre.includes('sin plan')
      if (filtro === 'otros') return !nombre.includes('sin plan') && !nombre.includes('con plan')
      return true
    })
    : []

  // Pie chart: contar sala y pilates
  let sala = 0
  let pilates = 0
  dataFiltrada.forEach((d) => {
    const nombre = d.Membresía?.toLowerCase() || ''
    if (nombre.includes('pilates')) pilates++
    else sala++
  })

  // Barra: agrupar por membresía y contar alumnos únicos
  const dataBarValid = dataFiltrada.map((d) => ({
    membresia: d.Membresía.trim() || 'Sin nombre',
    alumno: d.Alumno,
  }))
  const agrupados: Record<string, Set<string>> = {}
  dataBarValid.forEach((d) => {
    if (!agrupados[d.membresia]) agrupados[d.membresia] = new Set()
    agrupados[d.membresia].add(d.alumno)
  })
  const dataBarFinal = Object.entries(agrupados).map(([membresia, alumnosSet]) => ({
    membresia,
    cantidad: alumnosSet.size,
  }))

  const chartData = {
    labels: ['Sala', 'Pilates'],
    datasets: [
      {
        data: [sala, pilates],
        backgroundColor: ['rgba(234,115,58,255)', 'rgba(237,249,26,255)'],
        borderWidth: 1,
      },
    ],
  }

  function handleExportPagos() {
    if (!dataBar || !Array.isArray(dataBar) || dataBar.length === 0) return
    const ws = XLSX.utils.json_to_sheet(dataBar)
    const colNames = Object.keys(dataBar[0] || {})
    ws['!cols'] = colNames.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...dataBar.map((row) => (row[col] ? String(row[col]).length : 0)),
      )
      return { wch: maxLen + 2 }
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Expirados por membresía')
    XLSX.writeFile(wb, 'expirados-pagos.xlsx')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Alumnos totales a mes vencido</h2>
        <Button
          className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
          onClick={handleExportPagos}
          title="Exportar a Excel"
          variant="secondary"
        >
          <FiDownload />
        </Button>
      </div>
      <div className="mb-4 flex justify-center gap-2">
        {filtros.map((f) => (
          <button
            key={f.value}
            className={`rounded px-3 py-1 ${
              filtro === f.value ? 'bg-cerise-red-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFiltro(f.value as 'todos' | 'con_plan' | 'sin_plan' | 'otros')}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="text-center">
        <span className="text-xl font-semibold">Total alumnos: {sala + pilates}</span>
      </div>
      <div className="flex items-center justify-center">
        {isLoadingBar ? (
          <span>Cargando...</span>
        ) : (
          <PlansByTrainerChart pieTrainerData={chartData}
                               chartTitle="" />
        )}
      </div>
      <div className="mt-8 h-[1000px]">
        {isLoadingBar || !dataBarFinal.length ? (
          <span>Cargando estadísticas de membresía...</span>
        ) : (
          <ExpiredMonthChart databar={dataBarFinal} />
        )}
      </div>
    </div>
  )
}
