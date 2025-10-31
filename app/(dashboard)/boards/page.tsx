import { getActivePlan } from '@/app/actions/plan'
import prisma from '@/app/config/db/prisma'
import { getUserIdFromToken } from '@/app/utils/auth'
import { Tabs } from '@/components/ui/tabs'

import BoardList from './_components/BoardList'
import { FinishDayButton } from './_components/FinishDayButton'
import SelectBoard from './_components/SelectBoard'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const blocks = await prisma.socio.findMany({
    where: {
      idSocio: { lte: 500 },
    },
    select: {
      Nombre: true,
      plan: {
        include: {
          rutina_ejercicio: {
            include: { ejercicios: true },
            orderBy: [{ dia: 'asc' }, { nroEjercicio: 'asc' }],
          },
        },
      },
    },
    orderBy: { idSocio: 'asc' },
  })

  const idSocio = await getUserIdFromToken()
  const hasPlan = await getActivePlan(idSocio!)

  if (!hasPlan) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <svg
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mb-4 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mb-2 text-2xl font-semibold text-gray-600">
          No tienes acceso a esta sección
        </h2>
        <p className="text-gray-500">No tienes un plan activo o tu acceso no está habilitado.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-4xl font-semibold">Pizarras</h1>
        {!hasPlan && <FinishDayButton idSocio={idSocio} />}
      </div>
      <div className="h-6"></div>
      <Tabs defaultValue="board0">
        <SelectBoard boardList={blocks} />
        <div className="h-6 sm:h-10"></div>
        <BoardList blocks={blocks} />
      </Tabs>
    </div>
  )
}
