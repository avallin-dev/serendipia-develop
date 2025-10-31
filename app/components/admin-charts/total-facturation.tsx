'use client'

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'

import TotalChart from '@/app/charts/total-chart'

import CashChart from '@/app/charts/cash-chart'
import {
  useAverageMembershipValue,
  useBankVsCash,
  useFacturationByMembership,
  useFacturationByType,
  useHistorialPagos,
  usePendingFacturation,
} from '@/app/services/queries/chart'
import { Button } from '../ui/button'
import IncomeChart from '@/app/charts/income-chart'


ChartJS.register(ArcElement, Tooltip, Legend)
ChartJS.register(ChartDataLabels)

interface TotalFacturationProps {
  from?: Date
  to?: Date
}

export default function TotalFacturation({ from: fromProp, to: toProp }: TotalFacturationProps) {
  const now = new Date()
  const from = fromProp ?? new Date(now.getFullYear(), now.getMonth(), 1)
  const to = toProp ?? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const { data: dataBar, isLoading: isLoadingBar } = useFacturationByMembership({ from, to })
  const { data: pending, isLoading: isLoadingPending } = usePendingFacturation()
  const { data: avgValue, isLoading: isLoadingAvg } = useAverageMembershipValue({ from, to })
  const { data: bankVsCash, isLoading: isLoadingBankVsCash } = useBankVsCash({ from, to })
  const { data: factType } = useFacturationByType({ from, to })

  const { data: pagos = [] } = useHistorialPagos({ from: from.toISOString(), to: to.toISOString() })

  function handleExportPagos() {
    if (!pagos || pagos.length === 0) return
    const sheet = pagos.map((p) => ({
      Fecha: p.fecha ? new Date(p.fecha).toLocaleString('es-AR') : '',
      Alumno: p.alumno,
      Monto: `$ ${p.monto?.toLocaleString('es-AR', { minimumFractionDigits: 0 }) ?? 0}`,
      Membresía: p.membresia,
      Comentario: p.comentario,
    }))
    const ws = XLSX.utils.json_to_sheet(sheet)
    const colNames = Object.keys(sheet[0] || {})
    ws['!cols'] = colNames.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...sheet.map((row) => (row[col] ? String(row[col]).length : 0)),
      )
      return { wch: maxLen + 2 }
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos')
    XLSX.writeFile(wb, 'pagos-membresia.xlsx')
  }

  const chartData = {
    labels: ['Sala', 'Pilates'],
    datasets: [
      {
        data: [factType?.sala ?? 0, factType?.pilates ?? 0],
        backgroundColor: ['rgba(234,115,58,255)', 'rgba(237,249,26,255)'],
        borderWidth: 1,
      },
    ],
  }
  const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold">Facturación Total</h2>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
            onClick={handleExportPagos}
            title="Exportar pagos a Excel"
            variant="secondary"
          >
            <FiDownload />
            Pagos
          </Button>
        </div>
      </div>
      <div className="my-8 text-center">
        <span className="rounded-lg border bg-white p-4 text-3xl font-semibold ">
          ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div>
        <div className="flex items-center justify-center">
          {isLoadingBar ? (
            <span>Cargando...</span>
          ) : (
            <TotalChart pieTrainerData={chartData} />
          )}

        </div>
        <div className="mt-12">
          <h3 className="mb-2 text-xl font-semibold">FACTURACIÓN</h3>
          {isLoadingBar ? (
            <span>Cargando...</span>
          ) : (
            <IncomeChart dataBar={dataBar} />
          )}
        </div>
        {/* Facturación pendiente */}
        <div className="mt-12">
          <h3 className="mb-2 text-xl font-semibold">
            Facturación pendiente (comparativo mensual)
          </h3>
          {isLoadingPending ? (
            <span>Cargando...</span>
          ) : pending ? (
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border">
              <div className="flex">
                <div className="flex-1 p-3 text-center">
                  <div className="text-md text-gray-500">Mes actual</div>
                  <div
                    className={`text-xl font-bold ${
                      Number(pending.actual) >= Number(pending.anterior)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    $
                    {Number(pending.actual).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="flex-1 p-3 text-center">
                  <div className="text-md text-gray-500">Mes anterior</div>
                  <div className="text-xl font-bold">
                    $
                    {Number(pending.anterior).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
              <div className="flex border-t">
                <div className="flex-1 p-3 text-center text-md text-gray-500">Variación</div>
                <div
                  className={`flex-1 p-3 text-center font-bold text-xl ${
                    Number(pending.porcentaje) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {Number(pending.porcentaje).toFixed(1)}%
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-12">
          <h3 className="mb-2 text-center text-xl font-semibold">Valor de membresía promedio</h3>
          {isLoadingAvg ? (
            <span>Cargando...</span>
          ) : (
            <div className="text-center text-3xl font-bold">
              ${avgValue?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
        <div className="mt-12">
          <h3 className="mb-2 text-xl font-semibold">Transacciones bancarias vs efectivo</h3>
          {isLoadingBankVsCash ? (
            <span>Cargando...</span>
          ) : bankVsCash ? (
            <CashChart pieTrainerData={bankVsCash}
                       chartTitle="" />
          ) : null}
        </div>
      </div>
    </div>
  )
}
