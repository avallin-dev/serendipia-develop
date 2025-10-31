'use server'

import Pusher from 'pusher'

import prisma from '@/app/config/db/prisma'
import { notificationType } from '@/app/schemas/notification'

export async function submitNotification(values: notificationType) {
  const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
  const PUSHER_SECRET = process.env.PUSHER_SECRET || ''
  const PUSHER_APP_ID = process.env.PUSHER_APP_ID || ''
  const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ''
  const pusher = new Pusher({
    appId: PUSHER_APP_ID,
    cluster: PUSHER_CLUSTER,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    useTLS: true,
  })
  const { title, details, link, type, dni } = values
  let partner

  if (dni) {
    partner = await prisma.socio.findFirst({
      where: {
        DNI: dni,
      },
    })
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      details,
      externalLink: link,
      general: type === 'general',
      type: 'custom',
      userId: type !== 'general' ? partner?.idSocio : null,
    },
  })
  if (dni) {
    await pusher.trigger(`notify-${partner?.idSocio}`, 'sample-event', notification)
  }
}

export async function getNotifications(id: number) {
  const notificationList = await prisma.notification.findMany({
    where: {
      OR: [
        {
          userId: id,
          seen: false,
        },
        {
          general: true,
          notifications_deleted: { none: { userId: id } },
          notifications_read: { none: { userId: id } },
        },
      ],
    },
  })

  return notificationList.length
}
