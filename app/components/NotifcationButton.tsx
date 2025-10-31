'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiMegaphoneFill } from 'react-icons/ri'

import { getNotifications } from '@/app/actions/notification'
import { useAuth } from '@/app/hooks/useAuth'

import { Button } from './ui/button'
export default function NotificationButton() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [state, setState] = useState(0)
  const id = user?.idSocio

  useEffect(() => {
    if (id) {
      async function fetch() {
        const get = await getNotifications(id!)
        setState(get)
      }
      if (pathname !== '/notifications') {
        fetch()
      }
    }
  }, [id, pathname])
  if (pathname !== '/notifications') {
    return (
      <div className="flex items-center gap-x-2 lg:gap-x-4">
        {state ? (
          <div className="border-2 border-black bg-mine-shaft-900 px-3 py-2 text-center text-sm uppercase text-primary lg:text-base">
            ¡Tienes novedades!
          </div>
        ) : null}
        <Link href="/notifications">
          <Button variant="ghost" className="relative h-10 w-10 p-0 hover:bg-mine-shaft-100">
            {state ? (
              <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {state}
              </div>
            ) : null}
            <RiMegaphoneFill size={29} className="text-white" />
          </Button>
        </Link>
      </div>
    )
  } else {
    return null
  }
}
