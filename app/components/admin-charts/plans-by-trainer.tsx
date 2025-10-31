'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import PlansByTrainerChart from '@/app/charts/plans-by-trainer-chart'
import { usePlansByTrainer } from '@/app/services/queries/chart'
import { Button } from '../ui/button'

ChartJS.register(ArcElement, Tooltip, Legend)

function usePlansByTrainerChart() {
  const { data, isLoading } = usePlansByTrainer()
  const plansByTrainer: { [trainer: string]: number } = {}
  const plansToChangeByTrainer: { [trainer: string]: number } = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?.forEach((item: any) => {
    const trainer = item.profesor || 'Desconocido'
    plansByTrainer[trainer] = (plansByTrainer[trainer] || 0) + 1
    if (item.shouldChangePlan) {
      plansToChangeByTrainer[trainer] = (plansToChangeByTrainer[trainer] || 0) + 1
    }
  })
  return {
    loading: isLoading,
    plansByTrainer,
    plansToChangeByTrainer,
  }
}

export default function PlansByTrainer() {
  const { loading, plansByTrainer, plansToChangeByTrainer } = usePlansByTrainerChart()
  const { data } = usePlansByTrainer()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleExport(exportData: any[] | undefined) {
    if (!exportData) return
    const rows: {
      Entrenador: string
      Nombre: string
      'Fecha de inicio': string
      'Fecha de fin': string
      'Porcentaje de avance': string
    }[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportData.forEach((item: any) => {
      const entrenador = item.profesor || 'Desconocido'
      const alumno = item.nombreSocio || 'Sin nombre'
      const porcentajeAvance = item.progreso ? `${item.progreso}%` : '0%'
      const fechaInicio = item.fechaInicio
        ? new Date(item.fechaInicio).toLocaleDateString('es-AR')
        : ''
      const fechaFin = item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-AR') : ''
      rows.push({
        Nombre: alumno,
        'Fecha de inicio': fechaInicio,
        'Fecha de fin': fechaFin,
        'Porcentaje de avance': porcentajeAvance,
        Entrenador: entrenador,
      })
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)

    const colNames = Object.keys(rows[0] || {})
    ws['!cols'] = colNames.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...rows.map((row) => (row[col] ? String(row[col]).length : 0)),
      )
      return { wch: maxLen + 2 }
    })

    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos')
    XLSX.writeFile(wb, 'alumnos-por-entrenador.xlsx')
  }

  const pieTrainerData = {
    labels: Object.keys(plansByTrainer),
    datasets: [
      {
        data: Object.values(plansByTrainer),
        backgroundColor: [
          'rgb(96 165 250)',
          'rgb(250 204 21)',
          'rgb(248 113 113)',
          'rgb(34 197 94)',
          'rgb(139 92 246)',
          'rgb(253 186 116)',
          'rgb(244 63 94)',
        ],
      },
    ],
  }

  const pieChangeData = {
    labels: Object.keys(plansToChangeByTrainer),
    datasets: [
      {
        data: Object.values(plansToChangeByTrainer),
        backgroundColor: [
          'rgba(237,249,26,255)',
          'rgba(234,115,58,255)',
          'rgb(250 204 21)',
          'rgb(34 197 94)',
          'rgb(139 92 246)',
          'rgb(253 186 116)',
          'rgb(244 63 94)',
        ],
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Planes</h2>
        <Button
          className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
          onClick={() => handleExport(data)}
          title="Exportar a Excel"
          variant="secondary"
        >
          <FiDownload />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading ? (
          <span>Cargando...</span>
            ) :
          <><PlansByTrainerChart pieTrainerData={pieTrainerData}
                                 chartTitle="Planes por entrenador" />
            <PlansByTrainerChart pieTrainerData={pieChangeData}
                                 chartTitle="Planes por actualizar" /></>
        }
        {/*<div className="rounded-lg border bg-white p-4">*/}
        {/*  <h3 className="mb-4 text-xl font-semibold">Planes por entrenador</h3>*/}
        {/*  <div className="flex h-[300px] items-center justify-center">*/}
        {/*    {loading ? (*/}
        {/*      <span>Cargando...</span>*/}
        {/*    ) : (*/}
        {/*      <Pie*/}
        {/*        data={pieTrainerData}*/}
        {/*        options={{*/}
        {/*          maintainAspectRatio: false,*/}
        {/*          responsive: true,*/}
        {/*          plugins: {*/}
        {/*            legend: {*/}
        {/*              position: 'bottom',*/}
        {/*            },*/}
        {/*            tooltip: {*/}
        {/*              callbacks: {*/}
        {/*                label: function(context) {*/}
        {/*                  const value = context.parsed*/}
        {/*                  const total = context.dataset.data.reduce(*/}
        {/*                    (a: number, b: number) => a + b,*/}
        {/*                    0,*/}
        {/*                  )*/}
        {/*                  const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'*/}
        {/*                  return `${context.label}: ${value} (${porcentaje}%)`*/}
        {/*                },*/}
        {/*              },*/}
        {/*            },*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        plugins={[ChartDataLabels]}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className="rounded-lg border bg-white p-4">*/}
        {/*  <h3 className="mb-4 text-xl font-semibold">Planes por actualizar</h3>*/}
        {/*  <div className="flex h-[300px] items-center justify-center">*/}
        {/*    {loading ? (*/}
        {/*      <span>Cargando...</span>*/}
        {/*    ) : (*/}
        {/*      <Pie*/}
        {/*        data={pieChangeData}*/}
        {/*        options={{*/}
        {/*          maintainAspectRatio: false,*/}
        {/*          responsive: true,*/}
        {/*          plugins: {*/}
        {/*            legend: {*/}
        {/*              position: 'bottom',*/}
        {/*            },*/}
        {/*            tooltip: {*/}
        {/*              callbacks: {*/}
        {/*                label: function(context) {*/}
        {/*                  const value = context.parsed*/}
        {/*                  const total = context.dataset.data.reduce(*/}
        {/*                    (a: number, b: number) => a + b,*/}
        {/*                    0,*/}
        {/*                  )*/}
        {/*                  const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'*/}
        {/*                  return `${context.label}: ${value} (${porcentaje}%)`*/}
        {/*                },*/}
        {/*              },*/}
        {/*            },*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        plugins={[ChartDataLabels]}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}
