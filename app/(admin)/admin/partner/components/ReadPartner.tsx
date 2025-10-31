'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { LuUsers } from 'react-icons/lu'

import { OpenImage } from '@/app/(dashboard)/profile/_components'
import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { usePartner } from '@/app/services/queries/partner'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import CreateSample from './CreatePartner'
import DeletePartner from './DeletePartner'
import DeletePic from './DeletePic'
import TablePartnerPayments from './partner-membership/TablePartnerPayments'
import TablePartnerMembership, { PartnerMembershipType } from './TablePartnerMembership'
import UpdatePartner from './UpdatePartner'

function Partner() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [deletePicIsOpen, setDeletePicIsOpen] = useState(false)
  const [partnerMembershipIsOpen, setPartnerMembershipIsOpen] = useState(false)
  const [partnerPaymentsIsOpen, setPartnerPaymentsIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const id = searchParams?.get('partner')
  const { partner, isLoading } = usePartner(id!)

  const handleOnDeleteProfilePic = () => {
    setDeletePicIsOpen(true)
  }

  if (isLoading) return <TablesLoading />
  return (
    <>
      <div className="mb-10 flex justify-end gap-x-2">
        {partner && (
          <>
            {id && parseInt(id, 10) > 10 && (
              <Button
                variant="outline"
                className="border-secondary p-6"
                type="button"
                onClick={() => {
                  setPartnerPaymentsIsOpen(true)
                }}
              >
                Ver Pagos
              </Button>
            )}
            {!id ? (
              <Button
                variant="outline"
                className="border-secondary p-6"
                type="button"
                onClick={() => {
                  setPartnerMembershipIsOpen(true)
                }}
              >
                Afiliar a membresia
              </Button>
            ) : parseInt(id, 10) > 10 ? (
              <Button
                variant="outline"
                className="border-secondary p-6"
                type="button"
                onClick={() => {
                  setPartnerMembershipIsOpen(true)
                }}
              >
                Afiliar a membresia
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="border-primary p-6"
              type="button"
              onClick={() => {
                setUpdateIsOpen(true)
              }}
            >
              Editar {!id ? 'Socio' : parseInt(id, 10) > 10 ? 'Socio' : 'Pizarra'}
            </Button>
            <Button
              variant="destructive"
              className="p-6"
              onClick={() => {
                setDeleteIsOpen(true)
              }}
            >
              Eliminar {!id ? 'Socio' : parseInt(id, 10) > 10 ? 'Socio' : 'Pizarra'}
            </Button>
          </>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="p-6" onClick={() => setCreateIsOpen(true)}>
              Crear Socio
            </Button>
          </DialogTrigger>
          {createIsOpen && (
            <CreateSample onClose={() => setCreateIsOpen(false)} open={createIsOpen} />
          )}
          {updateIsOpen && (
            <UpdatePartner
              onClose={() => setUpdateIsOpen(false)}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              partner={partner}
              open={updateIsOpen}
            />
          )}
          {deleteIsOpen && (
            <DeletePartner
              onClose={() => setDeleteIsOpen(false)}
              id={partner?.idSocio}
              open={deleteIsOpen}
            />
          )}
          {partnerMembershipIsOpen && (
            <TablePartnerMembership
              onClose={() => setPartnerMembershipIsOpen(false)}
              partnerMemberships={partner?.sociomembresia as unknown as PartnerMembershipType[]}
              partnerId={partner?.idSocio}
              open={partnerMembershipIsOpen}
            />
          )}
          {partnerPaymentsIsOpen && (
            <TablePartnerPayments
              onClose={() => setPartnerPaymentsIsOpen(false)}
              partnerMemberships={partner?.sociomembresia}
              idSocio={partner?.idSocio}
              open={partnerPaymentsIsOpen}
            />
          )}
          {deletePicIsOpen && (
            <DeletePic
              onClose={() => setDeletePicIsOpen(false)}
              id={partner?.idSocio}
              open={deletePicIsOpen}
            />
          )}
        </Dialog>
      </div>
      {partner ? (
        <div className="grid gap-5 md:grid-cols-3">
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">Nombre completo</h3>
              <div>
                {partner?.Nombre} {partner?.Paterno} {partner?.Materno}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">DNI</h3>
              <div>{partner?.DNI}</div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">Nivel</h3>
              <div>
                {partner?.nivel ?? (
                  <span className="text-xm font-semibold text-gray-400">No añadido</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">Telefono</h3>
              <div>
                {partner?.Telefono ?? (
                  <span className="text-xm font-semibold text-gray-400">No añadido</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">Observaciones</h3>
              <div>
                {partner?.Observaciones ?? (
                  <span className="text-xm font-semibold text-gray-400">No añadido</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {partner?.fechaNacimiento && (
                <>
                  <h3 className="text-lg font-bold text-secondary-dark">fechaNacimiento</h3>
                  <div>
                    {partner?.fechaNacimiento && format(partner?.fechaNacimiento, 'dd/MM/yyyy')}
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">correo</h3>
              <div>
                {partner?.correo ?? (
                  <span className="text-xm font-semibold text-gray-400">No añadido</span>
                )}
              </div>
            </div>
            {partner?.clave && (
              <div className="space-y-2">
                <>
                  <h3 className="text-lg font-bold text-secondary-dark">Clave</h3>
                  <div>{partner?.clave}</div>
                </>
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-secondary-dark">Plan</h3>
              <div>
                {partner?.idPlan ?? (
                  <span className="text-xm font-semibold text-gray-400">No añadido</span>
                )}
              </div>
            </div>

            {partner?.image_profile ? (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-secondary-dark">Imagen de perfil</h3>
                <div className="relative h-28 w-28 rounded-full bg-secondary ">
                  <OpenImage
                    src={partner.image_profile ? partner.image_profile : ''}
                    disabled={partner?.image_profile ? false : true}
                  >
                    <Image
                      src={partner?.image_profile ?? '/images/Logo_2.png'}
                      alt=""
                      priority
                      sizes="100%"
                      fill
                      style={{ objectFit: `${partner?.image_profile ? 'cover' : 'contain'}` }}
                      className={`rounded-full ${partner?.image_profile ? 'p-1' : 'p-5 pt-7'}`}
                    />
                  </OpenImage>
                  <div className="absolute right-0 top-0 cursor-pointer rounded-full bg-slate-200 p-1.5 hover:opacity-75">
                    <FaRegTrashAlt
                      color="red"
                      size={20}
                      onClick={handleOnDeleteProfilePic}
                      className=" "
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-gray-100 p-4">
            <LuUsers className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No hay socios seleccionado</h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Aún no hay socios seleccionado. Aquí se mostrara información relacionada al socio
          </p>
        </div>
      )}
    </>
  )
}

export default function ReadPartner() {
  return (
    <Suspense>
      <Partner />
    </Suspense>
  )
}
