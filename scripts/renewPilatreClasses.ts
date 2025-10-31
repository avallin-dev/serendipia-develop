import { PrismaClient } from '@prisma/client'
import { differenceInWeeks, format } from 'date-fns'

import { createFullPilate } from '../app/actions/pilate'

const prisma = new PrismaClient()

async function renewPilatesClasses() {
  try {
    let counter = 0
    console.info('🔍 Iniciando búsqueda de socios...\n')

    // Obtener membresías que tienen registros en sociomembresia_pilates
    const activeMemberships = await prisma.sociomembresia.findMany({
      where: {
        idEstado: 1,
        sociomembresiaPilates: {
          some: {},
        },
        fechaInicioMembresia: { not: null },
        Vencimiento: {
          not: null,
          gt: new Date(), // asegura que la fecha de vencimiento sea mayor que la fecha actual
        },
      },
      include: {
        sociomembresiaPilates: true,
        socio: true,
      },
    })

    for (const membresia of activeMemberships) {
      // Verificar que tenga fechas válidas
      if (!membresia.fechaInicioMembresia || !membresia.Vencimiento) {
        console.info(`Membresía ${membresia.idSocioMembresia} con fechas inválidas`)
        continue
      }

      const totalSemanas = differenceInWeeks(membresia.Vencimiento, membresia.fechaInicioMembresia)

      // Obtener las clases de pilates del socio en el período
      const pilatesExistentes = await prisma.pilates.count({
        where: {
          idSocio: membresia.idSocio,
          start: {
            gte: membresia.fechaInicioMembresia,
          },
        },
      })

      if (pilatesExistentes < membresia.sociomembresiaPilates.length * totalSemanas) {
        counter++
        console.info(`📍 Procesando socio ${counter}:`)
        console.info(
          `Nombre: ${membresia.socio?.Nombre} ${membresia.socio?.Paterno} (ID: ${membresia.idSocio})`
        )
        console.info(`- Clases actuales: ${pilatesExistentes}`)
        console.info(`- Clases programadas: ${membresia.sociomembresiaPilates.length}`)
        console.info(`- Semanas de membresía: ${totalSemanas}`)
        console.info(`- Fecha inicio: ${format(membresia.fechaInicioMembresia, 'dd/MM/yyyy')}`)
        console.info(`- Fecha fin: ${format(membresia.Vencimiento, 'dd/MM/yyyy')}`)

        // Preparar datos para createFullPilate
        const pilateData = {
          idSocio: membresia.idSocio?.toString() || '',
          class1Day: '',
          class1Time: '',
          class2Day: '',
          class2Time: '',
          class3Day: '',
          class3Time: '',
          class4Day: '',
          class4Time: '',
          class5Day: '',
          class5Time: '',
        }

        // Llenar los datos con sociomembresia_pilates
        membresia.sociomembresiaPilates.forEach((pilateClass, index) => {
          const classNumber = index + 1
          if (classNumber <= 5) {
            pilateData[`class${classNumber}Day`] = pilateClass.day
            pilateData[`class${classNumber}Time`] = pilateClass.time
          }
        })

        console.info('Datos a procesar:', pilateData)

        try {
          const result = await createFullPilate(pilateData)
          console.info('Resultado:', result)
        } catch (error) {
          console.error(`Error al procesar socio ${membresia.idSocio}:`, error)
        }

        console.info('------------------------')
      }
    }

    console.info(`\n✅ Total de socios procesados: ${counter}`)
  } catch (error) {
    console.error('❌ Error al actualizar pilates:', error)
    throw error
  }
}

renewPilatesClasses()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
