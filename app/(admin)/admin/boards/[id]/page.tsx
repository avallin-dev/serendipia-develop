import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import RoutineList from '@/app/(dashboard)/boards/[id]/_components/RoutineList'
import SelectBoard from '@/app/(dashboard)/boards/[id]/_components/SelectBoard'
import prisma from '@/app/config/db/prisma'

export default async function Page({ params }: { params: { id: string } }) {
  const boards = await prisma.rutina_ejercicio.findMany({
    where: {
      dia: { gt: 10 },
      plan: { idSocio: parseInt(params.id) },
    },
    select: {
      repeticionS1: true,
      comentarioS1: true,
      ejercicios: {
        select: {
          categoria_ej: { select: { nombreCat: true } },
          nombreEj: true,
          linkEj: true,
        },
      },
      plan: {
        select: { NombrePlan: true, idSocio: true },
      },
      nroEjercicio: true,
    },
  })
  const boardList = await prisma.socio.findMany({
    where: {
      idSocio: { lte: 500 },
    },
    select: { Nombre: true },
    orderBy: { idSocio: 'asc' },
  })

  const seenPlans = new Set()
  const plans = boards
    .filter((e) => {
      if (!seenPlans.has(e.plan.NombrePlan)) {
        seenPlans.add(e.plan.NombrePlan)
        return true
      } else return false
    })
    .map((e) => e.plan.NombrePlan)

  return (
    <div>
      <div className="flex items-center gap-x-3">
        <Link href="/boards">
          <ArrowLeftIcon className="h-7 w-7" />
        </Link>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {boardList.find((e, i) => (i + 1).toString() === params.id)?.Nombre}
        </h1>
      </div>
      <div className="h-4"></div>
      <SelectBoard boardList={boardList} />
      <div className="h-7"></div>
      <div className="grid grid-cols-2 grid-rows-2">
        {plans.map((plan, index) => (
          <div key={'value' + index}>
            <RoutineList boards={boards} plan={plan} />
          </div>
        ))}
      </div>
    </div>
  )
}
