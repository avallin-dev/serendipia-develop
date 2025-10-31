'use client'

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

import { Combobox } from '@/app/components/Combobox'
import { Dialog } from '@/app/components/ui/dialog'
import { Separator } from '@/app/components/ui/separator'
import { usePartnersByType } from '@/app/services/queries/partner'
import { PartnerRoutine } from '@/app/types/partner'
import { PlanType } from '@/app/types/plan'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { CategoriesTable } from './categories/CategoriesTable'
import { DeletePartner } from './DeletePartner'
import { GroupMembers } from './group-members/GroupMembers'
import { PlanTable } from './plan/PlanTable'
import { UpdatePartner } from './UpdatePartner'

type PartnerType = 'bloque' | 'grupo' | 'socio'

export function PartnerTable() {
  const [partner, setPartner] = useState<PartnerRoutine | null | undefined>(null)
  const [plan, setPlan] = useState<PlanType | null>(null)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<PartnerType>('socio')
  const [isUpdate, setIsUpdate] = useState(false)
  const { partners, isFetching } = usePartnersByType(selectedType)

  const partnerData = partners.map((e) => ({
    value: e.idSocio.toString(),
    label:
      selectedType === 'socio'
        ? `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''}`
        : `${e.Nombre}`,
  }))

  const typeOptions = [
    { value: 'bloque', label: 'Bloque' },
    { value: 'grupo', label: 'Grupo' },
    { value: 'socio', label: 'Socio' },
  ]

  useEffect(() => {
    if (partners && !isFetching) {
      setPartner(partners?.[0] || null)
    }
  }, [partners, isFetching])
  return (
    <div>
      <Dialog>
        {updateIsOpen && (
          <UpdatePartner
            onClose={() => {
              setUpdateIsOpen(false)
              setIsUpdate(false)
            }}
            open={updateIsOpen}
            type={selectedType}
            partner={partner}
            isUpdate={isUpdate}
          />
        )}
        {deleteIsOpen && (
          <DeletePartner
            onClose={() => setDeleteIsOpen(false)}
            id={partner?.idSocio}
            open={deleteIsOpen}
            type={selectedType}
          />
        )}
      </Dialog>
      <div className="mb-4">
        <div className="mb-2 font-bold">Tipo de selección</div>
        <div className="flex gap-x-2">
          <Combobox
            data={typeOptions}
            placeholder="Seleccione tipo"
            onChange={(value) => setSelectedType(value as PartnerType)}
            value={selectedType}
            className="w-1/2"
          />
          {selectedType !== 'socio' && (
            <Button
              variant="secondary"
              className="h-9 w-48 rounded-md"
              onClick={() => setUpdateIsOpen(true)}
            >
              Nuevo {selectedType === 'bloque' ? 'Bloque' : 'Grupo'}
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3">
        <div>
          <div className="font-bold">
            Datos del{' '}
            {selectedType === 'socio' ? 'socio' : selectedType === 'grupo' ? 'grupo' : 'bloque'}
          </div>
          <Table>
            <TableBody className="text-sm">
              <TableRow className="bg-gray-300">
                <TableCell className="rounded-tl-lg pl-5 font-semibold">Nombre</TableCell>
                <TableCell className="rounded-tr-lg pr-5">
                  <Combobox
                    data={partnerData}
                    placeholder="partner"
                    onChange={(value) =>
                      setPartner(partners.find((e) => e.idSocio === parseInt(value)))
                    }
                    value={partner?.idSocio?.toString() || ''}
                  />
                </TableCell>
              </TableRow>
              {selectedType === 'socio' ? (
                <>
                  <TableRow>
                    <TableCell className="pl-5 font-semibold">Telefono</TableCell>
                    <TableCell className="flex items-center gap-2 pr-5">
                      {partner && partner?.idSocio > 10 && partner?.Telefono?.toString()}
                      {partner && partner?.idSocio > 10 && partner?.Telefono && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(`https://wa.me/${partner.Telefono}`, '_blank')}
                        >
                          <FaWhatsapp className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-300">
                    <TableCell className="pl-5 font-semibold">Observaciones</TableCell>
                    <TableCell className="pr-5">{partner && partner?.Observaciones}</TableCell>
                  </TableRow>
                </>
              ) : null}
              {partner?.idSocio && selectedType !== 'socio' && (
                <TableRow>
                  <TableCell className="rounded-bl-lg pl-5 font-semibold">Acciones</TableCell>
                  <TableCell className="rounded-br-lg pr-5">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        setIsUpdate(true)
                        setUpdateIsOpen(true)
                      }}
                    >
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="ml-2"
                      size="icon"
                      onClick={() => setDeleteIsOpen(true)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {partner?.idSocio && partner.idPlan && selectedType === 'grupo' && (
                <TableRow>
                  <TableCell colSpan={2} className="p-0">
                    <GroupMembers
                      members={partner.miembros}
                      partnerId={partner.idSocio}
                      type={'socio'}
                    />
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="rounded-bl-lg pl-5 font-semibold">
                  {selectedType === 'socio' ? 'Grupo' : ''}
                </TableCell>
                <TableCell className="rounded-br-lg pr-5">
                  {selectedType === 'socio' && partner?.grupo ? `${partner.grupo.Nombre}` : ''}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>{plan && <CategoriesTable semanas={plan?.semanas} idPlan={plan?.idPlan} />}</div>
      </div>
      <Separator className="my-5" />
      <div className="font-bold">Plan</div>
      {partner && (
        <PlanTable
          partner={partner}
          setPartner={setPartner}
          plan={plan}
          setPlan={setPlan}
          selectedType={selectedType}
        />
      )}
    </div>
  )
}
