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
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface AdminChartsProps {
  membershipStats: {
    vencidas: number
    porVencer: number
  }
  planStats: {
    vencidos: number
    porVencer: number
  }
  paymentStats: {
    labels: string[]
    data: number[]
  }
}

export function AdminCharts({ membershipStats, planStats, paymentStats }: AdminChartsProps) {
  const membershipData = {
    labels: ['Vencidas', 'Por Vencer'],
    datasets: [
      {
        data: [membershipStats.vencidas, membershipStats.porVencer],
        backgroundColor: ['rgb(248 113 113)', 'rgb(250 204 21)'],
      },
    ],
  }

  const planData = {
    labels: ['Vencidos', 'Por Vencer'],
    datasets: [
      {
        data: [planStats.vencidos, planStats.porVencer],
        backgroundColor: ['rgb(248 113 113)', 'rgb(250 204 21)'],
      },
    ],
  }

  const paymentData = {
    labels: paymentStats.labels,
    datasets: [
      {
        label: 'Pagos',
        data: paymentStats.data,
        backgroundColor: 'rgb(96 165 250)',
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold">Estadísticas de Membresías</h3>
        <div className="h-[300px]">
          <Pie
            data={membershipData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                      const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return `${context.label}: ${value} (${porcentaje}%)`
                    },
                  },
                },
                datalabels: {
                  color: '#222',
                  font: { weight: 'bold' },
                  formatter: (value, context) => {
                    const dataset = context.chart.data.datasets[0].data as number[]
                    const total = dataset.reduce((a, b) => a + b, 0)
                    const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                    return `${value}\n(${porcentaje}%)`
                  },
                  anchor: 'center',
                  align: 'center',
                },
              },
            }}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold">Estadísticas de Planes</h3>
        <div className="h-[300px]">
          <Pie
            data={planData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                      const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return `${context.label}: ${value} (${porcentaje}%)`
                    },
                  },
                },
                datalabels: {
                  color: '#222',
                  font: { weight: 'bold' },
                  formatter: (value, context) => {
                    const dataset = context.chart.data.datasets[0].data as number[]
                    const total = dataset.reduce((a, b) => a + b, 0)
                    const porcentaje = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                    return `${value}\n(${porcentaje}%)`
                  },
                  anchor: 'center',
                  align: 'center',
                },
              },
            }}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>

      <div className="col-span-1 rounded-lg border bg-white p-4 md:col-span-2">
        <h3 className="mb-4 text-lg font-semibold">Resumen de Pagos</h3>
        <div className="h-[300px]">
          <Bar
            data={paymentData}
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
        </div>
      </div>
    </div>
  )
}
