'use client'
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
import { useState } from 'react'
import { DateRange } from 'react-date-range'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { ConcurrenciaChart } from '@/app/components/admin-charts/concurrency-bar'
import MembershipsOnExpired from '@/app/components/admin-charts/memberships-on-expired'
import PlansByTrainer from '@/app/components/admin-charts/plans-by-trainer'
import StudentsExpired from '@/app/components/admin-charts/students-expired'
import TotalFacturation from '@/app/components/admin-charts/total-facturation'
import VentasTable from '@/app/components/admin-charts/ventas-table'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/app/components/ui/dialog'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

ChartJS.defaults.font.size = 18

export default function Page() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const [range, setRange] = useState([
    {
      startDate: firstDay,
      endDate: lastDay,
      key: 'selection',
    },
  ])
  const from = range[0].startDate
  const to = range[0].endDate
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold">Reportes</h1>
      <div className="mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="rounded border bg-white px-4 py-2 shadow" type="button">
              {from?.toLocaleDateString()} - {to?.toLocaleDateString()}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle></DialogTitle>
            <div className="flex justify-center">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  const { startDate, endDate, key } = item.selection
                  setRange([
                    {
                      startDate: startDate ?? new Date(),
                      endDate: endDate ?? new Date(),
                      key: key ?? 'selection',
                    },
                  ])
                }}
                moveRangeOnFirstSelection={false}
                ranges={range}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-500">Serendipia en números</h2>
        </div>
        {/* <DownloadReportButton /> */}
      </div>
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold">Historial de check-ins</h2>
          <HistorialCheckins />
        </div>
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold">Historial de pagos</h2>
          <HistorialPagos />
        </div>
      </div> */}
      {/* <div className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Historial de visitantes</h2>
        <HistorialVisitantes />
      </div> */}
      <div className="mt-6">
        <TotalFacturation from={from} to={to} />
      </div>
      <div className="mt-12">
        <ConcurrenciaChart from={from?.toISOString()} to={to?.toISOString()} />
      </div>
      <div className="mt-12">
        <MembershipsOnExpired />
      </div>
      <div className="mt-12">
        <StudentsExpired from={from} to={to} />
      </div>
      <div className="mt-12">
        <PlansByTrainer />
      </div>
      <div className="mt-12">
        <VentasTable />
      </div>
      {/* <AdminCharts
        membershipStats={membershipStats}
        planStats={planStats}
        paymentStats={paymentStats}
      /> */}
    </div>
  )
}
