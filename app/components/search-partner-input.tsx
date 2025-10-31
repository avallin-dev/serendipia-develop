'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, Suspense } from 'react'

import { Combobox } from '@/app/components/Combobox'

import { usePartnersBoards } from '../services/queries/partner'

function SearchInput() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams?.get('partner')
  const { partners } = usePartnersBoards()
  const partnerData = partners.map((e) => ({
    value: e.idSocio.toString(),
    label: `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''} `,
  }))
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <div className="relative mx-auto flex max-w-2xl flex-col items-center p-4">
        <div className="relative w-full">
          <Combobox
            data={partnerData}
            placeholder="Ingrese el nombre o apellido del socio"
            onChange={(value) => {
              router.push(pathname + '?' + createQueryString('partner', value))
            }}
            value={id || ''}
            className="h-14 border-gray-300 px-5 py-4 caret-blue-600 shadow-sm hover:shadow-md focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </>
  )
}

export default function SearchInputWrap() {
  return (
    <Suspense>
      <SearchInput />
    </Suspense>
  )
}
