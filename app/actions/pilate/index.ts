'use server'

import { sociomembresia_pilates } from '@prisma/client'
import {
  startOfHour,
  startOfDay,
  endOfDay,
  add,
  differenceInMonths,
  format,
  differenceInWeeks,
} from 'date-fns'
import { es } from 'date-fns/locale'

import prisma from '@/app/config/db/prisma'
import { pilateSchmaType, pilateFullSchmaType } from '@/app/schemas/pilate'
import { getUserIdFromToken } from '@/app/utils/auth'
import {setupPilatesDisponibles} from "@/scripts/setupPilatesDisponibles";

export type PartnerByIdType = {
  Nombre: string | null
  Paterno: string | null
  DNI: string | null
}

export async function getPilates(startDate?: Date, endDate?: Date) {
  const where = startDate && endDate ? { start: { gte: startDate, lt: endDate } } : undefined
  const data = await prisma.pilates.findMany({
    where,
    include: { socio: true },
  })

  const formattedPilate = data.map((pilateItem) => {
    return {
      ...pilateItem,
      title: pilateItem.title
        ? pilateItem.title
        : `${pilateItem.socio?.Nombre ?? ''} ${pilateItem.socio?.Paterno ?? ''}`,
      end: pilateItem.end.toISOString(),
      start: pilateItem.start.toISOString(),
      socio: {
        ...pilateItem.socio,
        huella: null,
        foto: null,
      },
    }
  })

  return formattedPilate
}

export async function getPilatesByPartner() {
  const idSocio = await getUserIdFromToken()
  const data = await prisma.pilates.findMany({
    where: {
      idSocio: idSocio,
      OR: [
        { fap: null },
        {
          NOT: {
            fap: 'F',
          },
        },
      ],
    },
  })

  return data
}

export async function createPilate(data: pilateSchmaType) {
  const {
    idSocio,
    title,
    classType,
    start,
    end,
  }: {
    idSocio?: string
    title?: string
    classType: 'disponible' | 'recuperativa' | 'prueba'
    start: Date
    end: Date
  } = data
  const startDate = startOfHour(start)
  const endDate = startOfHour(end)
  const partner = await prisma.socio.findFirst({
    where: {
      idSocio: Number(idSocio),
    },
    include: {
      sociomembresia: {
        where: {
          idEstado: 1,
          membresia: {
            Nombre: { contains: 'PILATES' },
          },
        },
        take: 1,
        include: {
          pilates_disponibles: true,
        },
      },
    },
  })

  /** @description puede que sea necesario evitar que se realice este Update */
    await setupPilatesDisponibles();

  const membership = partner?.sociomembresia[0]
  if (
    classType === 'disponible' &&
    membership?.pilates_disponibles &&
    membership?.pilates_disponibles?.clases_ocupadas >=
      membership?.pilates_disponibles?.clases_disponibles
  ) {
    return {
      success: true,
      message: 'Error: Todas las clases del socio ocupadas',
    }
  }

  const existingEventsByPartner = await prisma.pilates.findMany({
    where: {
      idSocio: Number(idSocio),
    },
  })
  const existingEvents = await prisma.pilates.findMany({
    where: {
      start: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: { bed: true, fap: true },
  })

  const fapFCount = existingEvents.filter((event) => event.fap === 'F').length
  const usedBeds = existingEvents.map((event) => event.bed)

  const totalBeds = 6 + fapFCount
  const availableBed = Array.from({ length: totalBeds }, (_, i) => i + 1).find(
    (bed) => !usedBeds.includes(bed)
  )

  const color =
    classType === 'recuperativa'
      ? 'MAGENTA'
      : existingEventsByPartner.length >= 4
      ? 'WHITE'
      : 'PURPLE'

  if (!availableBed) {
    return {
      success: true,
      message: 'No hay camas disponibles para esta hora.',
    }
  }
  const pilates = await prisma.pilates.create({
    data: {
      ...(idSocio && { idSocio: Number(idSocio) }),
      title: partner ? `${partner?.Nombre ?? ''} ${partner?.Paterno ?? ''}` : title,
      end,
      start,
      bed: availableBed,
      color: classType === 'prueba' ? 'ORANGE' : color,
    },
  })
  if (['recuperativa', 'disponible'].includes(classType)) {
    const membershipSocioMembresia = membership?.idSocioMembresia
    await prisma.pilates_disponibles.update({
      where: { idSocioMembresia: membershipSocioMembresia! },
      data: {
        clases_ocupadas: { increment: 1 },
      },
    })
  }

  return {
    success: true,
    message: `Clase creada en la cama ${availableBed}`,
    idPilates: pilates.id,
  }
}

export async function getPartnerMembershipWithPilates(idSocio?: number | null) {
  const partner = await prisma.socio.findFirst({
    where: { idSocio: Number(idSocio) },
    include: {
      sociomembresia: {
        where: {
          idEstado: 1,
          membresia: {
            Nombre: { contains: 'PILATES' },
          },
          // Vencimiento: {
          //   gte: new Date(),
          // },
        },
        take: 1,
        include: {
          sociomembresiaPilates: true,
        },
      },
    },
  })

  const data = partner?.sociomembresia[0]?.sociomembresiaPilates

  return data
}

export async function createFullPilate(data: pilateFullSchmaType) {
  const message: string[] = []
  const partner = await prisma.socio.findFirst({
    where: { idSocio: Number(data.idSocio) },
    include: {
      sociomembresia: {
        where: {
          idEstado: 1,
          membresia: {
            Nombre: { contains: 'PILATES' },
          },
        },
        take: 1,
        include: {
          membresia: true,
          pilates_disponibles: true,
        },
      },
    },
  })

  const { ['idSocio']: idSocio, ...classes } = data

  const membership = partner?.sociomembresia[0]
  const pilatesDisponibles = membership?.pilates_disponibles

  const { Vencimiento, fechaInicioMembresia } = membership!
  if (!pilatesDisponibles) return ['No hay registro de pilates_disponibles para esta membresía.']
  if (fechaInicioMembresia! >= Vencimiento!)
    return ['Error: el inicio de membresia es mayor al vencimiento']
  if (!fechaInicioMembresia || !Vencimiento) return ['Error: fechas de membresia erróneas']
  if (differenceInMonths(Vencimiento, fechaInicioMembresia) > 6)
    return ['Error: la membresia es muy larga']

  const existingClasses = await prisma.sociomembresia_pilates.findMany({
    where: { sociomembresiaId: membership.idSocioMembresia },
  })
  const existingEventsByPartnerOne = await prisma.pilates.count({
    where: {
      idSocio: Number(idSocio),
      start: {
        gte: fechaInicioMembresia!,
      },
    },
  })
  const totalSemanas = differenceInWeeks(Vencimiento, fechaInicioMembresia)

  const newClasses: { day: string; time: string }[] = []
  const notChangeClasses: sociomembresia_pilates[] = []
  const changedClasses: sociomembresia_pilates[] = []

  for (let i = 1; i <= 5; i++) {
    const dayKey = `class${i}Day`
    const timeKey = `class${i}Time`

    if (classes[dayKey] && classes[timeKey]) {
      const existingClass = existingClasses.find(
        (c) => c.day === classes[dayKey] && c.time === classes[timeKey]
      )

      if (!existingClass || existingEventsByPartnerOne < existingClasses.length * totalSemanas) {
        newClasses.push({ day: classes[dayKey], time: classes[timeKey] })
      } else {
        notChangeClasses.push(existingClass)
      }
    }
  }

  changedClasses.push(
    ...existingClasses.filter(
      (existing) =>
        !notChangeClasses.some((c) => c.day === existing.day && c.time === existing.time)
    )
  )

  if (changedClasses.length > 0) {
    for (const changedClass of changedClasses) {
      await deletePilateAll(changedClass.id)
    }
  }

  for (const newClass of newClasses) {
    await prisma.sociomembresia_pilates.create({
      data: {
        sociomembresiaId: membership.idSocioMembresia,
        day: newClass.day,
        time: newClass.time,
      },
    })
  }

  for (
    let currentDate = new Date(fechaInicioMembresia);
    currentDate <= add(new Date(Vencimiento), { weeks: 1 });
    currentDate = add(currentDate, { weeks: 1 })
  ) {
    if (currentDate > new Date(Vencimiento)) {
      console.info('Se ha alcanzado la fecha límite, deteniendo el bucle.')
      break
    }
    for (const newClass of newClasses) {
      const eventDay = parseInt(newClass.day, 10)
      const [hours] = newClass.time.split(':').map(Number)

      const adjustedDate = new Date(
        Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
      )

      const dayOffset = (eventDay - adjustedDate.getUTCDay() + 7) % 7
      adjustedDate.setUTCDate(adjustedDate.getUTCDate() + dayOffset)
      const eventDate = new Date(
        Date.UTC(
          adjustedDate.getUTCFullYear(),
          adjustedDate.getUTCMonth(),
          adjustedDate.getUTCDate(),
          hours,
          0,
          0
        )
      )

      if (eventDate >= fechaInicioMembresia! && eventDate <= add(Vencimiento!, { weeks: 1 })) {
        const existingEvents = await prisma.pilates.findMany({
          where: {
            start: {
              gte: fechaInicioMembresia!,
              lte: add(Vencimiento!, { weeks: 1 }),
            },
          },
        })
        const existingEventsByPartner = await prisma.pilates.findMany({
          where: {
            idSocio: Number(idSocio),
          },
        })

        const eventsAtSameTime = existingEvents.filter((event) => {
          return event.start.getTime() === eventDate.getTime()
        })

        const fapFCount = eventsAtSameTime.filter((event) => event.fap === 'F').length
        const usedBeds = eventsAtSameTime.map((event) => event.bed)

        const totalBeds = 6 + fapFCount
        const availableBed = Array.from({ length: totalBeds }, (_, i) => i + 1).find(
          (bed) => !usedBeds.includes(bed)
        )

        if (
          availableBed &&
          !existingEventsByPartner.some((event) => event.start.getTime() === eventDate.getTime())
        ) {
          const color = existingEventsByPartner.length >= 4 ? 'WHITE' : 'PURPLE'
          await prisma.pilates.create({
            data: {
              idSocio: parseInt(idSocio, 10),
              start: eventDate,
              end: add(eventDate, { minutes: 60 }),
              bed: availableBed,
              color,
            },
          })

          await prisma.pilates_disponibles.update({
            where: { idSocioMembresia: membership.idSocioMembresia },
            data: {
              clases_ocupadas: { increment: 1 },
            },
          })
        } else {
          message.push(
            `No hay camas disponibles para la fecha: ${format(eventDate, 'eeee dd/MM', {
              locale: es,
            })}`
          )
        }
      }
    }
  }
  const lastPilate = await prisma.pilates.findFirst({
    where: { idSocio: Number(idSocio) },
    orderBy: { createdAt: 'desc' },
  })
  if (lastPilate)
    await prisma.pilates.update({
      where: { id: lastPilate.id },
      data: {
        color: 'RED',
      },
    })
  const restante = await prisma.pilates_disponibles.findFirst({
    where: { idSocioMembresia: membership.idSocioMembresia },
  })
  if (restante)
    if (restante?.clases_ocupadas > restante?.clases_disponibles) {
      message.unshift('Todas las clases creadas exitosamente')
    } else {
      message.unshift(
        `Clases creadas exitosamente - ${
          restante.clases_disponibles - restante.clases_ocupadas
        } clases pendientes`
      )
    }
  return message
}

export async function deletePilate(id: number) {
  const pilate = await prisma.pilates.findUnique({
    where: { id },
  })

  const sociosMembresia = await prisma.sociomembresia.findFirst({
    where: {
      idSocio: pilate?.idSocio,
      idEstado: 1,
      membresia: {
        Nombre: { contains: 'PILATES' },
      },
      Vencimiento: {
        gte: new Date(),
      },
    },
    take: 1,
  })
  const membership = sociosMembresia?.[0]
  if (membership?.idSocioMembresia) {
    await prisma.pilates_disponibles.update({
      where: { idSocioMembresia: membership.idSocioMembresia },
      data: {
        clases_ocupadas: { decrement: 1 },
      },
    })
  }

  await prisma.pilates.delete({
    where: { id },
  })
}

export async function deletePilateAll(sociomembresiaPilatesId: number) {
  const sociomembresiaPilates = await prisma.sociomembresia_pilates.findUnique({
    where: { id: sociomembresiaPilatesId },
    include: { sociomembresia: true },
  })
  if (!sociomembresiaPilates) return
  const membership = sociomembresiaPilates.sociomembresia
  const { Vencimiento, fechaInicioMembresia } = membership
  if (fechaInicioMembresia! >= Vencimiento!) return
  if (!fechaInicioMembresia || !Vencimiento) return
  for (
    let currentDate = new Date(fechaInicioMembresia);
    currentDate <= add(new Date(Vencimiento), { weeks: 1 });
    currentDate = add(currentDate, { weeks: 1 })
  ) {
    if (currentDate > new Date(Vencimiento)) {
      console.info('Se ha alcanzado la fecha límite, deteniendo el bucle.')
      break
    }
    const adjustedDate = new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
    )
    const dayOffset = (Number(sociomembresiaPilates.day) - adjustedDate.getUTCDay() + 7) % 7
    const [hours] = sociomembresiaPilates.time.split(':').map(Number)
    adjustedDate.setUTCDate(adjustedDate.getUTCDate() + dayOffset)
    const eventDate = new Date(
      Date.UTC(
        adjustedDate.getUTCFullYear(),
        adjustedDate.getUTCMonth(),
        adjustedDate.getUTCDate(),
        hours,
        0,
        0
      )
    )
    const pilates = await prisma.pilates.findFirst({
      where: {
        start: eventDate,
        idSocio: membership.idSocio,
      },
    })
    if (pilates) {
      await prisma.pilates.delete({
        where: {
          id: pilates.id,
        },
      })
      const pilates_disponibles = await prisma.pilates_disponibles.findFirst({
        where: { idSocioMembresia: membership.idSocioMembresia },
      })
      if (pilates_disponibles?.clases_ocupadas && pilates_disponibles?.clases_ocupadas > 0) {
        await prisma.pilates_disponibles.update({
          where: { id: pilates_disponibles.id },
          data: {
            clases_ocupadas: { decrement: 1 },
          },
        })
      }
    }
  }
  await prisma.sociomembresia_pilates.delete({
    where: { id: sociomembresiaPilatesId },
  })
}

// export async function updatePilate(id: number, data: updatePilateType) {
//   await prisma.pilates.update({
//     where: {
//       id,
//     },
//     data: {
//       idSocio: Number(data.idSocio),
//       end: data.end,
//       start: data.start,
//     },
//   })
// }

export async function getPilatesRecover() {
  const idSocio = await getUserIdFromToken()

  const data = await prisma.pilates_recover.findMany({
    where: { idSocio: idSocio, AND: [{ pilatesRecovered: null }] },
    include: { pilates: true },
  })

  return data
}

export async function getPilatesAvailable(date: Date) {
  const MAX_BEDS = 6
  const startDate = startOfDay(date)
  const endDate = endOfDay(date)
  const pilatesClasses = await prisma.pilates.findMany({
    where: {
      start: {
        gte: startDate,
        lt: endDate,
      },
      AND: [
        {
          pilates_recover: null,
        },
      ],
    },
    select: {
      start: true,
      end: true,
    },
  })
  const slotsMap = new Map<string, { start: Date; end: Date; occupiedBeds: number }>()

  pilatesClasses.forEach((cls) => {
    const slotKey = cls.start.toISOString()
    if (slotsMap.has(slotKey)) {
      slotsMap.get(slotKey)!.occupiedBeds += 1
    } else {
      slotsMap.set(slotKey, { start: cls.start, end: cls.end, occupiedBeds: 1 })
    }
  })

  const availableEvents = Array.from(slotsMap.values()).map((slot) => ({
    title: `${MAX_BEDS - slot.occupiedBeds} camas disponibles`,
    start: slot.start,
    end: slot.end,
  }))

  return availableEvents
}

export async function addFAPState(id: number, fap: 'F' | 'A' | 'P') {
  const pilate = await prisma.pilates.findFirst({ where: { id } })
  const shouldChange = pilate?.color !== 'ORANGE' && pilate?.color !== 'MAGENTA'
  await prisma.pilates.update({
    where: {
      id,
    },
    data: {
      fap,
      ...(shouldChange && { color: fap === 'F' ? 'RED' : 'PURPLE' }),
    },
  })

  if (fap === 'F' && pilate?.color !== 'ORANGE') {
    await prisma.pilates_recover.create({
      data: {
        idPilates: id,
        idSocio: pilate?.idSocio,
      },
    })
    return { message: 'Tienes 1 nueva clase disponible' }
  } else {
    return { message: 'Estado de la clase actualizado' }
  }
}

export async function createPilateAndSaveRecovered(data: pilateSchmaType, idPilates: number) {
  const pilatesRecovered = await createPilate(data)
  await prisma.pilates_recover.update({
    where: { idPilates },
    data: {
      idPilatesRecovered: pilatesRecovered.idPilates,
    },
  })

  return {
    success: true,
    message: 'Clase recuperada',
  }
}
