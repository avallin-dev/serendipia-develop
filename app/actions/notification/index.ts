'use server'

import prisma from '@/app/config/db/prisma'
import { notificationType } from '@/app/schemas/notification'

export async function getAllNotification() {
  const data = await prisma.notification.findMany({
    where: {
      NOT: { type: 'sample' },
    },
    include: {
      user: {
        select: {
          DNI: true,
          Nombre: true,
          Paterno: true,
        },
      },
    },
  })

  return data
}

export async function createNotification(data: notificationType) {
  let partner

  if (data.dni) {
    partner = await prisma.socio.findFirst({
      where: {
        DNI: data.dni,
      },
    })
  }

  await prisma.notification.create({
    data: {
      title: data.title,
      details: data.details,
      externalLink: data.link,
      general: data.type === 'general',
      type: 'custom',
      userId: data.type !== 'general' ? partner?.idSocio : null,
    },
  })
}

export async function deleteNotification(id: number) {
  await prisma.notifications_read.deleteMany({
    where: { notificationId: id },
  })
  await prisma.notifications_deleted.deleteMany({
    where: { notificationId: id },
  })
  await prisma.notification.delete({
    where: {
      id,
    },
  })
}

export async function updateNotification(id: number, data: notificationType) {
  let partner

  if (data.dni) {
    partner = await prisma.socio.findFirst({
      where: {
        DNI: data.dni,
      },
    })
  }
  await prisma.notification.update({
    where: { id },
    data: {
      title: data.title,
      details: data.details,
      externalLink: data.link,
      general: data.type === 'general',
      type: 'custom',
      userId: data.type !== 'general' ? partner?.idSocio : null,
    },
  })
}
