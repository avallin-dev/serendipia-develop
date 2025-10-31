// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const { PrismaClient } = require('@prisma/client')
const { addDays, endOfDay, startOfDay } = require('date-fns')

const prisma = new PrismaClient()
async function detectExpiringMemberships() {
  const today = new Date()
  const configExpirationData = await prisma.configuracion.findFirst({
    select: {
      mensajeVencimiento: true,
    },
  })
  const warningDay = addDays(today, configExpirationData?.mensajeVencimiento || 5)
  const start = startOfDay(warningDay)
  const end = endOfDay(warningDay)
  const memberships = await prisma.sociomembresia.findMany({
    where: {
      idEstado: 1,
      Vencimiento: {
        gte: start,
        lt: end,
      },
    },
  })

  for (const membership of memberships) {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId: membership.idSocio,
        title: 'Su membresia esta por expirar',
        createdAt: {
          lt: end,
        },
      },
    })
    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          title: 'Su membresia esta por expirar',
          details: `Expira en ${configExpirationData?.mensajeVencimiento || 5} dias`,
          type: 'sample',
          userId: membership.idSocio,
        },
      })
    }
  }

  // Actualizar a idEstado 2 las sociomembresías vencidas
  await prisma.sociomembresia.updateMany({
    where: {
      Vencimiento: { lt: today },
      idEstado: { not: 2 },
    },
    data: {
      idEstado: 2,
    },
  })
}

detectExpiringMemberships()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
