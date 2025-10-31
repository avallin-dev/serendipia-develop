'use client'

import type { notification } from '@prisma/client'
import { formatDistance } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaExternalLinkAlt, FaLink } from 'react-icons/fa'

import { getNotification, deleteAllNotifications, readAllNotifications } from '@/app/actions'
import { Button } from '@/app/components/ui/button'
import { useAuth } from '@/app/hooks/useAuth'

export default function Page() {
  const { user } = useAuth()
  const id = user?.idSocio
  const [notifications, setNotifications] = useState<notification[]>()
  useEffect(() => {
    async function fetch() {
      await readAllNotifications(id!)
      const get = await getNotification(id!)
      setNotifications(get)
    }
    fetch()
  }, [id])

  async function handleClickDeleteAll(id: number) {
    await deleteAllNotifications(id)
    setNotifications([])
  }

  return (
    <div className="relative">
      <h1 className="text-4xl font-semibold">Notificaciones</h1>
      <div className="h-6"></div>
      <div className="flex justify-end">
        <Button onClick={() => handleClickDeleteAll(id!)} variant="ghost" className="mb-3">
          Limpiar
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 divide-y">
        {notifications?.map((notification) => (
          <div
            key={`notification-${notification.id}`}
            className="flex rounded-2xl bg-gray-200 px-8 py-3"
          >
            <div className="flex flex-grow flex-col">
              <div className="text-lg font-medium">{notification.title}</div>
              <div className="text-sm">{notification.details!}</div>
              <div className="text-sm text-gray-600">
                {formatDistance(new Date(), notification?.createdAt, {
                  addSuffix: false,
                  locale: es,
                })}
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              {notification.refLink && (
                <Link href={notification.refLink || ''}>
                  <Button variant="ghost" className="h-20 w-20">
                    <FaLink size={25} />
                  </Button>
                </Link>
              )}
              {notification.externalLink && (
                <Link href={notification.externalLink} target="_blank">
                  <Button variant="ghost" className="h-20 w-20">
                    <FaExternalLinkAlt size={25} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
