'use client'

import { plan, socio } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import useConfirm from '@/app/hooks/use-confirm'
import { useWeek } from '@/app/hooks/useWeek'
import { useFinishPlanDay, useUnFinishPlanDay } from '@/app/services/mutations/plan'
import { usePlanProgress } from '@/app/services/queries/plan'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import ModalFeedback from './ModalFeedback'

export function FinishDayButton({ plan, session }: { plan: plan | null; session: socio | null }) {
  const { currentDay, week } = useWeek()
  const idPlan = plan?.idPlan
  const idSocio = session?.idSocio
  const { data } = usePlanProgress(idPlan)
  const [done, setDone] = useState(false)
  const [accumulatedDay, setAccumulatedDay] = useState(1)
  const [finishedPlan, setFinishedPlan] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState(false)
  const queryClient = useQueryClient()
  const [ConfirmationDialog, confirm] = useConfirm('Si', `¿Seguro quieres desmarcar este progreso?`)
  const [isDayCompleted, setIsDayCompleted] = useState(false)

  useEffect(() => {
    if (data) {
      if (plan) {
        const dias = plan?.dias
        setAccumulatedDay((week - 1) * dias! + currentDay)
        setIsDayCompleted(data.diasCompletados.includes(accumulatedDay))
      }
      if (data.porcentajeProgreso >= 100) setFinishedPlan(true)
    }
  }, [data, currentDay, plan, week, accumulatedDay])

  const finishPlanMutation = useFinishPlanDay()
  const unFinishPlanMutation = useUnFinishPlanDay()

  async function handleOnClick() {
    if (isDayCompleted) {
      const ok = await confirm()
      if (ok) {
        unFinishPlanMutation.mutate(
          { day: accumulatedDay, idPlan: idPlan! },
          {
            onSuccess() {
              queryClient.invalidateQueries({ queryKey: ['plan-progress', idPlan] })
              setIsDayCompleted(false)
              toast.info('Entrenamiento desmarcado')
            },
            onError(error) {
              console.error(error)
              toast.error('Error al desmarcar el día. Intenta más tarde')
            },
          },
        )
      }
    } else {
      finishPlanMutation.mutate(
        { day: currentDay, week, idPlan: idPlan!, idSocio: idSocio! },
        {
          onSuccess(response) {
            queryClient.invalidateQueries({ queryKey: ['plan-progress', idPlan] })
            setIsDayCompleted(true)
            setDone(true)
            toast.success('Entrenamiento completado')
            if (response && response >= 100) {
              setFeedbackModal(true)
            }
          },
          onError(error) {
            console.error(error)
            toast.error('Error inesperado. Intenta más tarde')
          },
        },
      )
    }
  }

  // const fechaCreacion = dataMonitor?.fechaCreacion ? new Date(dataMonitor.fechaCreacion) : null
  // const now = new Date()
  // const showButton = fechaCreacion && now.getTime() - fechaCreacion.getTime() > 60 * 60 * 1000

  return (
    <div className="flex gap-2">
      <ConfirmationDialog />
      {true && (
        <Button
          className={cn(
            'h-14 flex-wrap rounded-sm py-0 text-xs uppercase sm:h-10',
            isDayCompleted ? 'bg-primary-dark text-white hover:bg-primary-dark' : '',
          )}
          onClick={handleOnClick}
        >
          {isDayCompleted ? 'Día Completado' : 'Finalizar Entrenamiento'}
        </Button>
      )}
      {finishedPlan ? (
        <p
          className="flex h-auto flex-col items-center justify-center rounded-sm border-2 border-black bg-magenta px-1.5 py-0 text-center text-xs text-white md:h-10">
          <span className="uppercase">¡Has completado tu plan!</span>
          <span>Sigamos entrenando juntos</span>
        </p>
      ) : done ? (
        <p
          className="flex h-14 flex-col items-center justify-center rounded-sm border-2 border-black bg-red-500 px-3 py-0 text-center text-xs text-white md:h-10">
          <span className="uppercase">¡Excelente entrenamiento!</span>
          <span>Recorda alimentarte y descansar bien</span>
        </p>
      ) : null}
      <ModalFeedback
        open={feedbackModal}
        onClose={() => setFeedbackModal(false)}
        planId={idPlan!}
      />
    </div>
  )
}
