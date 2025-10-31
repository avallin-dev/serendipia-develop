
import { socio } from '@prisma/client'
import { format } from 'date-fns'
import es from 'date-fns/locale/es'
import Link from 'next/link'
import { MdLocalPhone } from 'react-icons/md'

import { getSessionSocio } from '@/app/actions'
import { getPlan } from '@/app/actions/plan'
import { Button } from '@/app/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'

import { FinishDayButton } from './components/FinishDayButton'
import ProgressBar from './components/ProgressBar'
import { ReminderModal } from './components/ReminderModal'
import SelectDay from './components/SelectDay'
import SelectWeek from './components/SelectWeek'
import TabRutines from './components/TabRutines'
import { ActivatePlanModal } from '@/app/(dashboard)/routines/components/ActivatePlanModal'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const session: socio = await getSessionSocio()
  const plan = await getPlan()

  return (
    <div className="relative">
      <ReminderModal />
      <ActivatePlanModal idPlan={plan?.idPlan} nombrePlan={plan?.NombrePlan} />
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-medium tracking-wide">Hola {session.Nombre}</h3>
          <p className="text-sm tracking-wide">
            {format(new Date(), 'd \'de\' MMMM, yyyy', {
              locale: es,
            })}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ProgressBar idPlan={plan?.idPlan} />
          <p className="text-center text-xs font-semibold uppercase text-red-500">
            Avance del plan
          </p>
        </div>
      </div>
      {plan ? (
        <>
          {plan?.usuario?.Telefono && (
            <Link
              target="_blank"
              href={`https://wa.me/${plan?.usuario?.Telefono}`}
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                size="sm"
                variant="default"
                className="mb-4 h-10 gap-x-2 rounded-lg outline outline-secondary"
              >
                <MdLocalPhone size={24} className="flex-shrink-0" />
                <span className="text-primary-foreground">Enviar un WhatsApp a tu entrenador </span>
              </Button>
            </Link>
          )}
          <div className="h-2"></div>
          <SelectWeek plan={plan} />
          <div className="h-3 sm:h-2"></div>
          <Tabs defaultValue={`day${plan?.diaactual === plan?.dias ? 0 : plan?.diaactual || 0}`}>
            <SelectDay planDays={plan?.dias} />
            <div className="h-3"></div>
            <FinishDayButton plan={plan} session={session} />
            {Array.from(Array.from({ length: plan?.dias || 1 }, (_, i) => i + 1)).map((e, i) => (
              <TabsContent key={'day' + i} value={'day' + i} className="mt-0">
                <TabRutines day={i + 1} planId={plan.idPlan} />
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div>No tienes plan asignado</div>
      )}
    </div>
  )
}
