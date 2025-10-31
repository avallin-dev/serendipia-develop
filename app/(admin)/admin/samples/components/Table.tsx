'use client'

import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { MdDelete, MdEditDocument } from 'react-icons/md'

import { getPartnerById, PartnerByIdType } from '@/app/actions/partner'
import { Button } from '@/app/components/ui/button'
import { useSamples } from '@/app/services/queries/sample/sample'
import type { Sample_Muestra } from '@/app/types/sample'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CreateSample from './CreateSample'
import DeleteSample from './DeleteSample'
import UpdateSample from './UpdateSample'

function TableSample() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedSample, setSelectedSample] = useState<Sample_Muestra | null>(null)
  const [partnerSearched, setpartnerSearched] = useState<PartnerByIdType | null | undefined>()
  const [data, setData] = useState<Sample_Muestra[]>([])
  const searchParams = useSearchParams()
  const id = searchParams?.get('partner')
  const { samples, isLoading, isFetching } = useSamples(id!)
  useEffect(() => {
    async function fetch() {
      const partnerResponse = await getPartnerById(parseInt(id!))
      setpartnerSearched(partnerResponse)
    }
    if (id) fetch()

    if (!isLoading && samples) {
      setData(samples)
    }
  }, [id, samples, isLoading, isFetching])

  return (
    <>
      <div className="mb-10 flex justify-between">
        {partnerSearched !== null ? (
          <div>
            {partnerSearched?.Nombre} {partnerSearched?.Paterno} - {partnerSearched?.DNI}
          </div>
        ) : (
          <div>Socio no existente</div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="p-6"
              disabled={!Boolean(id)}
              onClick={() => setCreateIsOpen(true)}
            >
              Agregar muestra
            </Button>
          </DialogTrigger>
          {createIsOpen && (
            <CreateSample
              onClose={() => setCreateIsOpen(false)}
              id={parseInt(id!)}
              open={createIsOpen}
            />
          )}
          {updateIsOpen && (
            <UpdateSample
              onClose={() => setUpdateIsOpen(false)}
              sample={selectedSample}
              open={updateIsOpen}
            />
          )}
          {deleteIsOpen && (
            <DeleteSample
              onClose={() => setDeleteIsOpen(false)}
              id={selectedSample?.id}
              open={deleteIsOpen}
            />
          )}
        </Dialog>
      </div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">
                Fecha
              </TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Peso</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">%M</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">%G</TableHead>
              <TableHead className="rounded-tr-lg pr-10 text-center font-bold text-chicago-600">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((sample: Sample_Muestra) => (
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
                <TableCell className="text-center text-chicago-600">
                  <span className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setUpdateIsOpen(true)
                        setSelectedSample(sample)
                      }}
                    >
                      <MdEditDocument color="#1A4E74" size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteIsOpen(true)
                        setSelectedSample(sample)
                      }}
                    >
                      <MdDelete color="#F74D4D" size={20} />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default function TableSampleWrap() {
  return (
    <Suspense>
      <TableSample />
    </Suspense>
  )
}
