'use client'

import { socio } from '@prisma/client'
import { useState } from 'react'
import { getSessionSocio } from '@/app/actions'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePlanProgress } from '@/app/services/queries/plan'

export function ActivatePlanModal({ idPlan, nombrePlan }: { idPlan?: number, nombrePlan?:string }) {
  const [isOpen, setIsOpen] = useState(true)
  const { data } = usePlanProgress(idPlan)
  const percentage = data?.porcentajeProgreso

  async function handleEnabled(): Promise<void> {
    const session: socio = await getSessionSocio()
    setIsOpen(session.authorization !== 1)
  }

  return (
    <Dialog open={Boolean(percentage && percentage == 0) && Boolean(nombrePlan && nombrePlan != 'Entrenamiento a distancia')} onOpenChange={_ => {
      handleEnabled().then()
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            COMENZAS UN PLAN NUEVO
          </DialogTitle>
          <DialogDescription className="text-center text-md text-secondary-dark mb-4">Acércate al profe para entrenar
            juntos</DialogDescription>
          <div className="text-center text-base mt-3.5">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">Es necesario que consultes a tu entrenador antes de comenzar cada
                nuevo plan de entrenamiento, te brindará consejos y te permitira comenzar el mismo</p>

              <p className="text-sm text-muted-foreground">
                Si ya tu entrenador te autorizó a comenzar el plan puedes obviar este mensaje y continuar con tus ejercicios
              </p>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
