'use client'

import React from 'react'

import ModalWrapper from '@/app/components/ModalWrapper'
import { usePlanResume } from '@/app/services/queries/plan'
import { PlanType } from '@/app/types/plan'
import formatBorg from '@/app/utils/formatBorg'

type PlanSummaryProps = {
  open: boolean
  onClose: () => void
  plan: PlanType
}

export default function PlanSummary({ open, onClose, plan }: PlanSummaryProps) {
  const { data } = usePlanResume(plan.idPlan)
  const bodyContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Socio:</h3>
          <p>{plan.socio?.Nombre}</p>
        </div>
        <div>
          <h3 className="font-semibold">Progreso del plan:</h3>
          <p>{data?.progreso.porcentajeProgreso}%</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Plan: {plan.NombrePlan}</h3>
        <p>Valoración: {formatBorg(data?.plan_feedback?.borg ?? '')}</p>
      </div>

      <div className="mt-4">
        <div className="rounded-lg bg-gray-100">
          {data?.rutina_ejercicio?.map((rutina) => (
            <div key={rutina.idRutina} className="mb-6">
              <h4 className="bg-gray-200 p-2 font-semibold">
                {rutina.ejercicios?.nombreEj ?? 'Ejercicio sin nombre'} - Día {rutina.dia}
              </h4>
              {rutina.has_details && rutina.detalles && rutina.detalles.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm">
                      <th className="p-2 text-left">Serie</th>
                      <th className="p-2 text-left">Peso</th>
                      <th className="p-2 text-left">Repeticiones</th>
                      <th className="p-2 text-left">Descanso</th>
                      <th className="p-2 text-left">RPE</th>
                      <th className="p-2 text-left">Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      rutina.detalles.reduce(
                        (acc, detalle) => {
                          const semana = detalle.semana || 1
                          if (!acc[semana]) acc[semana] = []
                          acc[semana].push(detalle)
                          return acc
                        },
                        {} as Record<number, typeof rutina.detalles>
                      )
                    ).map(([semana, detalles]) => (
                      <React.Fragment key={semana}>
                        <tr className="border-b">
                          <td colSpan={6} className="p-2 font-bold">
                            Semana {semana}
                          </td>
                        </tr>
                        {detalles.map((detalle) => (

                          <tr key={detalle.id} className="border-b text-sm">
                            <td><p>{detalle.serie}</p></td>
                            <td className="p-2">{detalle.serie}</td>
                            <td className="p-2">{detalle.peso || '-'}</td>
                            <td className="p-2">{detalle.repeticiones || '-'}</td>
                            <td className="p-2">{detalle.descanso || '-'}</td>
                            <td className="p-2">{detalle.rpe || '-'}</td>
                            <td className="p-2">{detalle.comentario || '-'}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No hay detalles disponibles para este ejercicio
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <ModalWrapper isOpen={open} onClose={onClose} title="Resumen del Plan" body={bodyContent} />
  )
}
