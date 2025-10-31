'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { format, differenceInDays } from 'date-fns'
import { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'

import { useAllSociomemberships } from '@/app/services/queries/membership'

import { Button } from '../ui/button'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function MembershipsOnExpired() {
  const { sociomemberships, isLoading } = useAllSociomemberships()
  const now = new Date()

  // Paginación para por vencer
  const [pagePorVencer, setPagePorVencer] = useState(1)
  const rowsPerPage = 10

  // Paginación para vencidas
  const [pageVencidas, setPageVencidas] = useState(1)

  const porVencer =
    sociomemberships?.filter((m: any) => {
      if (!m.Vencimiento) return false
      const vencimiento = new Date(m.Vencimiento)
      const diff = differenceInDays(vencimiento, now)
      return diff >= 0 && diff <= 5
    }) || []

  const vencidas =
    sociomemberships?.filter((m: any) => {
      if (!m.Vencimiento) return false
      const vencimiento = new Date(m.Vencimiento)
      const diasVencida = differenceInDays(now, vencimiento)
      return diasVencida > 1 && diasVencida <= 365
    }) || []

  // Slices para paginación
  const paginatedPorVencer = porVencer.slice(
    (pagePorVencer - 1) * rowsPerPage,
    pagePorVencer * rowsPerPage
  )
  const paginatedVencidas = vencidas.slice(
    (pageVencidas - 1) * rowsPerPage,
    pageVencidas * rowsPerPage
  )

  function handleExport() {
    const porVencerSheet = porVencer.map((m: any) => ({
      Socio: `${m.socio?.Nombre ?? ''} ${m.socio?.Paterno ?? ''}`.trim(),
      Membresía: m.membresia?.Nombre,
      Vence: m.Vencimiento ? format(new Date(m.Vencimiento), 'dd/MM/yyyy') : '-',
      Estado: m.estadoMembresia,
    }))
    const vencidasSheet = vencidas.map((m: any) => ({
      Socio: `${m.socio?.Nombre ?? ''} ${m.socio?.Paterno ?? ''}`.trim(),
      Membresía: m.membresia?.Nombre,
      Venció: m.Vencimiento ? format(new Date(m.Vencimiento), 'dd/MM/yyyy') : '-',
      Estado: m.estadoMembresia,
    }))
    const wb = XLSX.utils.book_new()
    const wsPorVencer = XLSX.utils.json_to_sheet(porVencerSheet)
    const colNamesPorVencer = Object.keys(porVencerSheet[0] || {})
    wsPorVencer['!cols'] = colNamesPorVencer.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...porVencerSheet.map((row) => (row[col] ? String(row[col]).length : 0))
      )
      return { wch: maxLen + 2 }
    })
    XLSX.utils.book_append_sheet(wb, wsPorVencer, 'Por vencer')
    const wsVencidas = XLSX.utils.json_to_sheet(vencidasSheet)
    const colNamesVencidas = Object.keys(vencidasSheet[0] || {})
    wsVencidas['!cols'] = colNamesVencidas.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...vencidasSheet.map((row) => (row[col] ? String(row[col]).length : 0))
      )
      return { wch: maxLen + 2 }
    })
    XLSX.utils.book_append_sheet(wb, wsVencidas, 'Vencidas')
    XLSX.writeFile(wb, 'membresias-expiradas.xlsx')
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Membresías por vencer y vencidas</h2>
        <Button
          className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
          onClick={handleExport}
          title="Exportar a Excel"
          variant="secondary"
        >
          <FiDownload />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="mb-2 text-xl font-semibold">Membresías por vencer (≤ 5 días)</h3>
          <div className="overflow-x-auto rounded border bg-white p-2">
            <table className="min-w-full text-base">
              <thead>
                <tr>
                  <th className="px-2 py-1">Socio</th>
                  <th className="px-2 py-1">Membresía</th>
                  <th className="px-2 py-1">Vence</th>
                  <th className="px-2 py-1">Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4}>Cargando...</td>
                  </tr>
                ) : paginatedPorVencer.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Sin membresías por vencer</td>
                  </tr>
                ) : (
                  paginatedPorVencer.map((m: any) => (
                    <tr key={m.idSocioMembresia}>
                      <td className="px-2 py-1">
                        {m.socio?.Nombre} {m.socio?.Paterno}
                      </td>
                      <td className="px-2 py-1">{m.membresia?.Nombre}</td>
                      <td className="px-2 py-1">
                        {m.Vencimiento ? format(new Date(m.Vencimiento), 'dd/MM/yyyy') : '-'}
                      </td>
                      <td className="px-2 py-1">{m.estadoMembresia}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Controles de paginación */}
            <div className="mt-2 flex justify-center gap-2">
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() => setPagePorVencer((p) => Math.max(1, p - 1))}
                disabled={pagePorVencer === 1}
              >
                Anterior
              </button>
              <span className="px-2 py-1">
                Página {pagePorVencer} de {Math.max(1, Math.ceil(porVencer.length / rowsPerPage))}
              </span>
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() =>
                  setPagePorVencer((p) =>
                    Math.min(Math.ceil(porVencer.length / rowsPerPage), p + 1)
                  )
                }
                disabled={
                  pagePorVencer === Math.ceil(porVencer.length / rowsPerPage) ||
                  porVencer.length === 0
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold">Membresías vencidas (más de 1 día)</h3>
          <div className="overflow-x-auto rounded border bg-white p-2">
            <table className="min-w-full text-base">
              <thead>
                <tr>
                  <th className="px-2 py-1">Socio</th>
                  <th className="px-2 py-1">Membresía</th>
                  <th className="px-2 py-1">Venció</th>
                  <th className="px-2 py-1">Estado</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4}>Cargando...</td>
                  </tr>
                ) : paginatedVencidas.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Sin membresías vencidas</td>
                  </tr>
                ) : (
                  paginatedVencidas.map((m: any) => (
                    <tr key={m.idSocioMembresia}>
                      <td className="px-2 py-1">
                        {m.socio?.Nombre} {m.socio?.Paterno}
                      </td>
                      <td className="px-2 py-1">{m.membresia?.Nombre}</td>
                      <td className="px-2 py-1">
                        {m.Vencimiento ? format(new Date(m.Vencimiento), 'dd/MM/yyyy') : '-'}
                      </td>
                      <td className="px-2 py-1">{m.estadoMembresia}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Controles de paginación */}
            <div className="mt-2 flex justify-center gap-2">
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() => setPageVencidas((p) => Math.max(1, p - 1))}
                disabled={pageVencidas === 1}
              >
                Anterior
              </button>
              <span className="px-2 py-1">
                Página {pageVencidas} de {Math.max(1, Math.ceil(vencidas.length / rowsPerPage))}
              </span>
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() =>
                  setPageVencidas((p) => Math.min(Math.ceil(vencidas.length / rowsPerPage), p + 1))
                }
                disabled={
                  pageVencidas === Math.ceil(vencidas.length / rowsPerPage) || vencidas.length === 0
                }
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
