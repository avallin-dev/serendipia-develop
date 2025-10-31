'use client'

import type { partner_addon } from '@prisma/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { AiOutlineDownload, AiOutlineLink } from 'react-icons/ai'

import { getPreviews } from '@/app/actions/getPreviews'
import { getPartnerById, PartnerByIdType } from '@/app/actions/partner'
import { Button } from '@/app/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function TableReviews() {
  const [previews, setPreviews] = useState<partner_addon[]>([])
  const [partner, setpartner] = useState<PartnerByIdType | null | undefined>()
  const searchParams = useSearchParams()
  const search = searchParams?.get('partner')
  useEffect(() => {
    async function fetch() {
      if (search) {
        const previewResponse = await getPreviews(parseInt(search!))
        setPreviews(previewResponse)
        const partnerResponse = await getPartnerById(parseInt(search!))
        setpartner(partnerResponse)
      }
    }

    fetch()
  }, [search])
  return (
    <>
      <div className="mb-10 flex justify-between">
        <div>
          {partner?.Nombre} {partner?.Paterno} - {partner?.DNI}
        </div>
      </div>
      <div className="shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            <TableRow>
              <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">ID</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Nombre</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Abrir</TableHead>
              <TableHead className="text-center font-bold text-chicago-600">Descargar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previews ? (
              previews.map((preview) => (
                <TableRow key={'preview-' + preview.id}>
                  <TableCell className="pl-10 text-chicago-600">{preview.id}</TableCell>
                  <TableCell className="text-center text-chicago-600">
                    {partner?.Nombre} {partner?.Paterno}
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    <Link target="_blank" href={preview?.pa_certificate} rel="noopener noreferrer">
                      <Button variant="ghost">
                        <AiOutlineLink size={25} />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center text-chicago-600">
                    <a
                      href={preview?.pa_certificate}
                      download="Document"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="ghost">
                        <AiOutlineDownload size={25} />
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <span className="p-5">No hay observaciones</span>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default function TableReviewsWrap() {
  return (
    <Suspense>
      <TableReviews />
    </Suspense>
  )
}
