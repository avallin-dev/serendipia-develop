// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function setStatusPilateClass() {
  try {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const pastPilates = await prisma.pilates.findMany({
      where: {
        start: {
          lt: now,
        },
        fap: null,
      },
    })

    if (pastPilates.length > 0) {
      pastPilates.forEach((element) => {
        const idSocio = element.idSocio
        const visitaExistente = await prisma.visita.findFirst({
          where: { idSocio },
        })
        await prisma.pilates.update({
          where: { id: element.id },
          data: {
            fap: visitaExistente ? 'P' : 'A',
          },
        })
      })

      console.info(`✅ Se actualizaron ${updatedPilates.count} registros.`)
    } else {
      console.info('✅ No hay reservas pasadas sin fap que actualizar.')
    }
  } catch (error) {
    console.error('❌ Error al actualizar pilates:', error)
    throw error
  }
}

setStatusPilateClass()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
