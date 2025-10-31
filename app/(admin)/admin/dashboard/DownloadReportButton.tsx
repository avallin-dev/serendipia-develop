'use client'

import { useState } from 'react'
import { TfiDownload } from 'react-icons/tfi'
import * as XLSX from 'xlsx'

import { Button } from '@/app/components/ui/button'
import { useExportIndicators } from '@/app/services/queries/chart'

function getLastSixMonths(): Array<{ month: number; year: number }> {
  const now = new Date()
  const months = [] as Array<{ month: number; year: number }>
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ month: date.getMonth() + 1, year: date.getFullYear() })
  }
  return months
}

export default function DownloadReportButton() {
  const { data, isLoading: isQueryLoading, error } = useExportIndicators()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!data) return
    setDownloading(true)
    try {
      const { pagos, checkins, visitantes, concurrencia } = data
      const meses = getLastSixMonths()

      function agruparPorMes(datos, campoFecha) {
        const conteo = {}
        datos.forEach((item) => {
          const fecha = new Date(item[campoFecha])
          const mes = fecha.getMonth() + 1
          const año = fecha.getFullYear()
          const key = `${mes}-${año}`
          conteo[key] = (conteo[key] || 0) + 1
        })
        return meses.map(({ month, year }) => ({
          mes: month,
          año: year,
          cantidad: conteo[`${month}-${year}`] || 0,
        }))
      }

      // Pagos: campo fecha = 'fecha'
      const pagosData = agruparPorMes(pagos, 'fecha')
      // Checkins: campo fecha = 'fechamod'
      const checkinsData = agruparPorMes(checkins, 'fechamod')
      // Visitantes: campo fecha = 'fechaCreacion'
      const visitantesData = agruparPorMes(visitantes, 'fechaCreacion')

      // Concurrencia: sumar concurrencia por mes
      const concurrenciaConteo = {}
      Object.entries(concurrencia).forEach(([dia, horas]) => {
        const fecha = new Date(dia)
        const mes = fecha.getMonth() + 1
        const año = fecha.getFullYear()
        const key = `${mes}-${año}`
        const total = Object.values(horas).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
        concurrenciaConteo[key] = (concurrenciaConteo[key] || 0) + total
      })
      const concurrenciaData = meses.map(({ month, year }) => ({
        mes: month,
        año: year,
        cantidad: concurrenciaConteo[`${month}-${year}`] || 0,
      }))

      // Crear el libro de Excel
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pagosData), 'Pagos')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(checkinsData), 'Checkins')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(visitantesData), 'Visitantes')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(concurrenciaData), 'Concurrencia')
      XLSX.writeFile(wb, 'reporte_detallado.xlsx')
    } catch (e) {
      alert('Error generando el reporte')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      className="items-center gap-2 bg-cerise-red-500 text-white hover:bg-cerise-red-600"
      onClick={handleDownload}
      disabled={isQueryLoading || downloading || !!error || !data}
    >
      <TfiDownload />
      Crear informe detallado
    </Button>
  )
}
