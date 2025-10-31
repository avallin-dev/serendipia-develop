import { format, isBefore } from 'date-fns'
import Image from 'next/image'

import prisma from '@/app/config/db/prisma'
import { getUserIdFromToken } from '@/app/utils/auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
export default async function Page() {
  const idSocio = await await getUserIdFromToken()
  const memberships = await prisma.sociomembresia.findMany({
    where: {
      idSocio: idSocio,
    },
    orderBy: { fechaCreacion: 'desc' },
    include: {
      membresia: true,
    },
    take: 1,
  })

  const StateIcon = ({ expiration }: { expiration: Date }) => {
    const isValid = isBefore(Date.now(), expiration)
    return (
      <Tooltip>
        <TooltipTrigger>
          <Image
            width={20}
            height={20}
            alt="icon_status"
            src={`/images/${isValid ? 'active_icon' : 'venced_icon'}.png`}
            className="w-h-5 h-5 object-contain"
          />
        </TooltipTrigger>
        <TooltipContent>{isValid ? 'Activo' : 'Inactivo'}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-semibold">Membresias</h1>
      <div className="h-20"></div>
      <h2 className="text-2xl font-medium text-dolphin">Estado de tu membresia</h2>
      <div className="h-10"></div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">
                Tipo de membresia
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">
                Fecha de inicio
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Fecha de fin</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">
                Estado de pago
              </TableHead>
              <TableHead className="rounded-tr-lg pr-10 text-center font-bold text-chicago-600">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships && memberships.length ? (
              memberships.map((membership) => (
                <TableRow key={'membership-' + membership.idSocioMembresia}>
                  <TableCell className="text-nowrap pl-10 font-medium text-chicago-600">
                    {membership.membresia?.Nombre}
                  </TableCell>
                  <TableCell className="text-center font-medium text-chicago-600">
                    {format(membership?.fechaInicioMembresia || Date.now(), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-center font-medium text-chicago-600">
                    {format(membership?.Vencimiento || Date.now(), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-nowrap text-center font-medium text-chicago-600">
                    {membership.estadoMembresia}
                  </TableCell>
                  <TableCell className="pr-10 text-center font-medium text-chicago-600">
                    <TooltipProvider>
                      <StateIcon expiration={membership?.Vencimiento || new Date(Date.now())} />
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-nowrap p-3 text-center text-lg font-semibold text-chicago-600"
                >
                  No tienes membresías disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
