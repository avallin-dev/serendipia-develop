'use client'

import { addMonths, format, subMonths } from 'date-fns'
import { useState } from 'react'

import { useHistorialPagos } from '@/app/services/queries/chart'

export function HistorialPagos({
                                 initialFrom,
                                 initialTo,
                               }: {
  initialFrom: string
  initialTo: string
}) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  // @typescript-eslint/no-unused-vars
  const { data, isLoading } = useHistorialPagos({ from, to })

  const handleMonth = (dir: 'prev' | 'next') => {
    const newFrom = dir === 'prev' ? subMonths(new Date(from), 1) : addMonths(new Date(from), 1)
    const newTo = dir === 'prev' ? subMonths(new Date(to), 1) : addMonths(new Date(to), 1)
    setFrom(newFrom.toISOString())
    setTo(newTo.toISOString())
  }

  return (
    <div>
      <div>
        <button onClick={() => handleMonth('prev')} disabled={isLoading}>
          &lt;
        </button>
        <span>{format(new Date(from), 'MMMM yyyy')}</span>
        <button onClick={() => handleMonth('next')} disabled={isLoading}>
          &gt;
        </button>
      </div>
      <table>
        <thead>
        <tr>
          <th>Fecha</th>
          <th>Socio</th>
          <th>Monto</th>
        </tr>
        </thead>
        <tbody>
        {/* {isLoading ? (
            <tr>
              <td colSpan={3}>Cargando...</td>
            </tr>
          ) : (
            data?.map((pago, i) => (
              <tr key={i}>
                <td>{pago.fecha}</td>
                <td>{pago.socio}</td>
                <td>${pago.monto}</td>
              </tr>
            ))
          )} */}
        </tbody>
      </table>
    </div>
  )
}
