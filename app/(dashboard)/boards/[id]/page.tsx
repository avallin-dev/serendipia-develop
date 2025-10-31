import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import prisma from '@/app/config/db/prisma'

import RoutineList from './_components/RoutineList'
import SelectBoard from './_components/SelectBoard'

export const dynamic = 'force-dynamic'
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
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">
          {boardList.find((e, i) => (i + 1).toString() === params.id)?.Nombre}
        </h1>
      </div>
      <div className="h-4"></div>
      <SelectBoard boardList={boardList} />
      <div className="h-5"></div>
      <div className="lg:grid lg:gap-3 2xl:grid-cols-2 2xl:grid-rows-1">
        {plans.map((plan, index) => (
          <RoutineList key={'value' + index} boards={boards} plan={plan} />
        ))}
      </div>
    </div>
  )
}
