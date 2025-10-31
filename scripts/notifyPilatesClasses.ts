// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function notifyPilatesClasses() {
  try {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    const todayPilates = await prisma.pilates.findMany({
      where: {
        start: {
          gte: startOfDay,
          lte: endOfDay,
        },
        fap: null,
      },
      select: {
        idSocio: true,
        start: true,
      },
    })
    console.info('🔹 Clases de pilates sin FAP hoy:', todayPilates)

    for (const pilates of todayPilates) {
      if (pilates.idSocio) {
        const hora = pilates.start.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        })

        await prisma.notification.create({
          data: {
            title: 'Tienes clase de pilates',
            details: `Asiste hoy a las ${hora} a tu clase de pilates`,
            type: 'custom',
            userId: pilates.idSocio,
          },
        })

        console.info(
          `✅ Notificación enviada a socio ${pilates.idSocio} para la clase a las ${hora}`
        )
      }
    }
  } catch (error) {
    console.error('❌ Error al actualizar pilates:', error)
    throw error
  }
}

notifyPilatesClasses()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
