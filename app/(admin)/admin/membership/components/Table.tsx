'use client'

import { membresia } from '@prisma/client'
import { format } from 'date-fns'
import { useState } from 'react'
import { MdDelete, MdEditDocument } from 'react-icons/md'

import { Button } from '@/app/components/ui/button'
import { useAllMemberships } from '@/app/services/queries/membership'
import {
  statusCode,
  typeMembershipCode,
  formatAmountByTypeMembership,
} from '@/app/utils/getNameById'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import CreateMembership from './CreateMembership'
import DeleteSample from './DeleteMembership'
import UpdateSample from './UpdateMembership'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<
    (membresia & { idMembresia: number }) | undefined
  >()
  const { memberships } = useAllMemberships()

  return (
    <>
      <div className="mb-10 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="p-6" onClick={() => setCreateIsOpen(true)}>
              Agregar membresia
            </Button>
          </DialogTrigger>
          {createIsOpen && (
            <CreateMembership onClose={() => setCreateIsOpen(false)} open={createIsOpen} />
          )}
          {updateIsOpen && (
            <UpdateSample
              onClose={() => setUpdateIsOpen(false)}
              data={selectedMembership}
              open={updateIsOpen}
            />
          )}
          {deleteIsOpen && (
            <DeleteSample
              onClose={() => setDeleteIsOpen(false)}
              id={selectedMembership?.idMembresia}
              open={deleteIsOpen}
            />
          )}
        </Dialog>
      </div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">ID</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Nombre</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Estado</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">
                Fecha de creación
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Precio</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">
                Hora de inicio
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Hora final</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">
                Tipo de membresia
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Cantidad</TableHead>
              <TableHead className="rounded-tr-lg pr-10 text-center font-bold text-chicago-600">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships &&
              memberships.map((membership) => (
                <TableRow key={'membership-' + membership.idMembresia}>
                  <TableCell className="pl-10 text-chicago-600">{membership.idMembresia}</TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership.Nombre}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership.idEstado && statusCode(membership.idEstado)}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership?.fechaCreacion && format(membership?.fechaCreacion, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership.Precio?.toString()}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership?.horaInicio && format(membership?.horaInicio, 'HH:mm')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {membership?.horaFinal && format(membership?.horaFinal, 'HH:mm')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {typeMembershipCode(membership.idTipoMembresia!)}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {formatAmountByTypeMembership({
                      typeMembership: membership.idTipoMembresia!,
                      months: membership.meses!,
                      weeks: membership.semanas!,
                      days: membership.dias!,
                    })}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    <TooltipProvider>
                      <span className="flex justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => {
                                setUpdateIsOpen(true)
                                setSelectedMembership(membership)
                              }}
                            >
                              <MdEditDocument color="#1A4E74" size={20} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeleteIsOpen(true)
                                setSelectedMembership(membership)
                              }}
                            >
                              <MdDelete color="#F74D4D" size={20} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Borrar</TooltipContent>
                        </Tooltip>
                      </span>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
