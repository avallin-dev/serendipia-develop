'use client'

import { sociomembresia, sociomembresia_pago } from '@prisma/client'
import { format, isAfter, startOfToday, subWeeks } from 'date-fns'
import { useState } from 'react'
import { MdAutorenew, MdDelete, MdEditDocument, MdPayments } from 'react-icons/md'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import { usePartnerMemberships } from '@/app/services/queries/partner'
import {
  statusCode,
  typeMembershipCode,
  formatAmountByTypeMembership,
} from '@/app/utils/getNameById'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import CreatePartnerMembership from './partner-membership/CreatePartnerMembership'
import DeletePartnerMembership from './partner-membership/DeletePartnerMembership'
import PayPartnerMembership from './partner-membership/PayPartnerMembership'
import RenewPartnerMembership from './partner-membership/RenewPartnerMembership'
import UpdatePartnerMembership from './partner-membership/UpdatePartnerMembership'

type TablePartnerMembershipProps = {
  onClose: () => void
  open: boolean
  partnerMemberships?: PartnerMembershipType[]
  partnerId?: number
}

export type PartnerMembershipType = sociomembresia & { sociomembresia_pago: sociomembresia_pago[] }

export default function TablePartnerMembership({
  onClose,
  open,
  partnerId,
}: TablePartnerMembershipProps) {
  const { partnerMemberships } = usePartnerMemberships(partnerId?.toString() || '')
  const [step, setStep] = useState<'table' | 'create' | 'update' | 'pay' | 'delete' | string>(
    'table'
  )
  const [partnerMembership, setPartnerMembership] = useState<PartnerMembershipType>()

  const handleOnClick = (step: string, data: PartnerMembershipType) => {
    if (data.estadoMembresia === 'Pagada'){
        setStep('update')
    } else setStep(step)
    setPartnerMembership(data)
  }
  const tableContent = (
    <>
      <div className="mb-2 flex justify-end gap-x-2">
        <Button
          variant="secondary"
          className="h-10 px-3 text-xs"
          type="button"
          size="sm"
          onClick={() => {
            setStep('create')
          }}
        >
          Afiliar a nueva membresia
        </Button>
      </div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 text-xs font-bold text-chicago-600">
                ID
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Nombre
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Activo
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Fecha de creación
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Precio
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Fecha de inicio
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Fecha de vencimiento
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Estado
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Tipo de membresia
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-chicago-600">
                Cantidad
              </TableHead>
              <TableHead className="rounded-tr-lg pr-10 text-center text-xs font-bold text-chicago-600">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerMemberships &&
              partnerMemberships.map((partnerMembership) => (
                <TableRow
                  key={'partnerMembership-' + partnerMembership.idSocioMembresia}
                  className={`${
                    partnerMembership.idEstado === 1 && 'bg-green-50 hover:bg-green-50'
                  }`}
                >
                  <TableCell className="pl-10 text-chicago-600">
                    {partnerMembership.idSocioMembresia}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership.membresia?.Nombre}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership.idEstado && statusCode(partnerMembership.idEstado)}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership?.fechaCreacion &&
                      format(partnerMembership?.fechaCreacion, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership?.membresia?.Precio?.toString()}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership?.fechaInicioMembresia &&
                      format(partnerMembership?.fechaInicioMembresia, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership?.Vencimiento &&
                      format(partnerMembership?.Vencimiento, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partnerMembership?.estadoMembresia}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {typeMembershipCode(partnerMembership.idTipoMembresia!)}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {formatAmountByTypeMembership({
                      typeMembership: partnerMembership.idTipoMembresia!,
                      months: partnerMembership.meses!,
                      weeks: partnerMembership.semanas!,
                      days: partnerMembership.dias!,
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
                              onClick={() =>
                                handleOnClick(
                                  'pay',
                                  partnerMembership as unknown as PartnerMembershipType
                                )
                              }
                            >
                              <MdPayments color="#1A4E74" size={15} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Pagar/Ver</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() =>
                                handleOnClick(
                                  'update',
                                  partnerMembership as unknown as PartnerMembershipType
                                )
                              }
                            >
                              <MdEditDocument color="#1A4E74" size={15} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        {partnerMembership?.Vencimiento &&
                          isAfter(startOfToday(), subWeeks(partnerMembership.Vencimiento, 1)) && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOnClick(
                                      'renew',
                                      partnerMembership as unknown as PartnerMembershipType
                                    )
                                  }
                                >
                                  <MdAutorenew color="#1A4E74" size={15} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Renovar</TooltipContent>
                            </Tooltip>
                          )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleOnClick(
                                  'delete',
                                  partnerMembership as unknown as PartnerMembershipType
                                )
                              }
                            >
                              <MdDelete color="#F74D4D" size={15} />
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

  switch (step) {
    case 'table':
      return (
        <ModalWrapper
          isOpen={open}
          onClose={onClose}
          title="Membresias del socio"
          body={tableContent}
          className="sm:max-w-5xl"
          hideFooter
        />
      )
    case 'create':
      return (
        <CreatePartnerMembership
          onClose={onClose}
          open={open}
          partnerId={partnerId}
          setStep={setStep}
        />
      )
    case 'delete':
      return (
        <DeletePartnerMembership
          onClose={onClose}
          open={open}
          partnerMembership={partnerMembership}
          setStep={setStep}
        />
      )
    case 'update':
      return (
        <UpdatePartnerMembership
          onClose={onClose}
          open={open}
          partnerMembership={partnerMembership}
          setStep={setStep}
          partnerId={partnerId}
        />
      )
    case 'pay':
      return (
        <PayPartnerMembership
          onClose={onClose}
          open={open}
          setStep={setStep}
          membershipId={partnerMembership?.idSocioMembresia}
          partnerId={partnerId}
          partnerMembership={partnerMembership}
        />
      )
    case 'renew':
      return (
        <RenewPartnerMembership
          onClose={onClose}
          open={open}
          partnerMembership={partnerMembership}
          setStep={setStep}
        />
      )
    default:
      break
  }
}
