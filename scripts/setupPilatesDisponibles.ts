// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

const { PrismaClient } = require('@prisma/client')
const { differenceInWeeks, isWithinInterval, addDays } = require('date-fns')

const prisma = new PrismaClient()

async function setupPilatesDisponibles() {
  try {
    console.info('🔍 Buscando membresías activas de Pilates...')
    // Obtener todas las sociomembresias activas con Pilates y no vencidas
    const sociosConPilates = await prisma.sociomembresia.findMany({
      where: {
        idEstado: 1, // Activa
        membresia: {
          Nombre: { contains: 'PILATES' }, // Membresías que contienen "PILATES"
        },
      },
      include: {
        membresia: true,
        pilates_disponibles: true,
        socio: { include: { pilates: true } }, // Para verificar si ya existe
      },
    })

    console.info(`📋 Se encontraron ${sociosConPilates.length} membresías activas de Pilates.`)

    let creados = 0

    for (const socio of sociosConPilates) {
      // Extraer el número de clases de pilates de la membresía
      const regex = /(\d+)\s*PILATES|PILATES\s*(\d+)/i
      const match = socio.membresia.Nombre.match(regex)
      const pilatesClasses = match ? parseInt(match[1] || match[2]) : 0

      if (pilatesClasses === 0) {
        console.warn(`❌ No se encontró cantidad de clases para ${socio.membresia.Nombre}`)
        continue
      }

      // Calcular número de semanas de la membresía
      const fechaInicio = new Date(socio.fechaInicioMembresia)
      const fechaFin = addDays(new Date(socio.Vencimiento), 7) // +1 semana extra
      const semanas = differenceInWeeks(fechaFin, fechaInicio)
      const clases_disponibles = semanas * pilatesClasses

      // Contar las clases ocupadas dentro del rango de membresía + 1 semana
      const clases_ocupadas =
        socio.socio?.pilates && socio.socio.pilates.length > 0
          ? socio.socio.pilates.filter((p) =>
              isWithinInterval(new Date(p.start), { start: fechaInicio, end: fechaFin })
            ).length
          : 0

      // Editar el registro en pilates_disponibles
      await prisma.pilates_disponibles.updateMany({
        where: { idSocioMembresia: socio.idSocioMembresia },
        data: {
          clases_disponibles,
          clases_ocupadas,
        },
      })

      creados++
      console.info(
        `✅ Actualizados pilates_disponibles para socio ${socio.socio.idSocio} con ${clases_disponibles} clases y ${clases_ocupadas} clases ocupadas.`
      )
    }

    console.info(
      `🎉 Finalizado. Se actualizaron ${creados} registros nuevos en pilates_disponibles.`
    )
  } catch (error) {
    console.error('❌ Error en setupPilatesDisponibles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupPilatesDisponibles()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
