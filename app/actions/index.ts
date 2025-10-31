'use server'
import prisma from '@/app/config/db/prisma'
import { getUserIdFromToken } from '@/app/utils/auth'

export async function getNotification(id: number) {
  const notificationList = await prisma.notification.findMany({
    where: {
      OR: [{ general: true }, { userId: id }],
      AND: {
        NOT: {
          notifications_deleted: {
            some: {
              userId: id,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return notificationList
}

export async function readAllNotifications(id: number) {
  if (!id) return
  const notifications = await getNotification(id)
  await Promise.all(
    notifications.map(async (notification) => {
      if (notification.general) {
        await prisma.notifications_read.upsert({
          create: {
            userId: id,
            notificationId: notification.id,
          },
          update: {},
          where: { userId_notificationId: { userId: id, notificationId: notification.id } },
        })
      } else {
        await prisma.notification.update({
          where: {
            id: notification.id,
          },
          data: {
            seen: true,
          },
        })
      }
    })
  )
}

export async function deleteAllNotifications(id: number) {
  const notifications = await getNotification(id)
  await Promise.all(
    notifications.map(async (notification) => {
      if (notification.general) {
        await prisma.notifications_deleted.createMany({
          data: {
            userId: id,
            notificationId: notification.id,
          },
        })
      } else {
        await prisma.notification.delete({
          where: {
            id: notification.id,
            userId: id,
          },
        })
      }
    })
  )
}

export async function getSetup() {
  const setup = await prisma.configuracion.findFirst({
    where: { idConfiguracion: 1 },
    select: { cantidadActual: true, cantidadAlta: true, cantidadBaja: true },
  })
  if (!setup) return

  const { cantidadActual, cantidadBaja, cantidadAlta } = setup
  if (cantidadActual < cantidadBaja) {
    return 'BAJA'
  } else if (cantidadActual >= cantidadBaja && cantidadActual <= cantidadAlta) {
    return 'NORMAL'
  } else if (cantidadActual > cantidadAlta) {
    return 'ALTA'
  }
}

export async function getSocioQR(id: number) {
  const membership = await prisma.sociomembresia.findFirst({
    where: { idSocio: id, idEstado: 1 },
    select: { socio: { select: { clave: true, image_profile: true } } },
  })
  return membership?.socio?.image_profile ? membership.socio.clave ?? '0' : '0'
}

export async function getSessionSocio() {
  const idSocio = await getUserIdFromToken()
  const data = await prisma.socio.findFirst({ where: { idSocio: idSocio! } })
  return data!
}

export async function submitEditProfile({
  partnerKey,
  data,
  id,
}: {
  partnerKey: string
  data: string
  id: number
}) {
  await prisma.socio.update({
    where: {
      idSocio: id,
    },
    data: {
      [partnerKey]: data,
    },
  })
}

export async function createPartnerAddon(data: string) {
  const partner = await getSessionSocio()
  await prisma.partner_addon.create({
    data: {
      pa_certificate: data,
      partnerId: partner?.idSocio,
    },
  })
}
