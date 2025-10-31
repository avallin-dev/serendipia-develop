import BoardList from '@/app/(dashboard)/boards/_components/BoardList'
import SelectBoard from '@/app/(dashboard)/boards/_components/SelectBoard'
import prisma from '@/app/config/db/prisma'
import { Tabs } from '@/components/ui/tabs'

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

  return (
    <div>
      <h1 className="text-4xl font-semibold">Pizarras</h1>
      <div className="h-6"></div>
      <Tabs defaultValue="board0">
        <SelectBoard boardList={blocks} />
        <div className="h-6 sm:h-10"></div>
        <BoardList blocks={blocks} />
      </Tabs>
    </div>
  )
}
