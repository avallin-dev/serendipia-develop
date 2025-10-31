import { format } from 'date-fns'

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

export default async function Page() {
  const idSocio = await getUserIdFromToken()
  const samples = await prisma.socio_muestra.findMany({
    where: {
      idSocio: idSocio,
      idEstado: 1,
    },
    orderBy: { id: 'desc' },
  })

  return (
    <div>
      <h1 className="text-4xl font-semibold">Muestras</h1>
      <div className="h-20"></div>
      <h2 className="text-2xl font-medium text-dolphin">Medidas antropometricas</h2>
      <div className="h-24"></div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">
                Fecha
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Peso</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">%M</TableHead>
              <TableHead className="rounded-tr-lg pr-10 text-center font-bold text-chicago-600">
                %G
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samples.map((sample) => (
              <TableRow key={'sample-' + sample.id}>
                <TableCell className="pl-10 text-chicago-600">
                  {format(sample?.fechaMuestra || Date.now(), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="text-center text-chicago-600">
                  {sample?.peso?.toString() || ''}
                </TableCell>
                <TableCell className="text-center text-chicago-600">
                  {sample?.porcentajeGrasaCorporal?.toString() || ''}
                </TableCell>
                <TableCell className="text-center text-chicago-600">
                  {sample?.porcentajeGrasaCorporal?.toString() || ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
