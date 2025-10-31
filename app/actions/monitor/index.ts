'use server'
import { startOfDay, endOfDay, isSameDay } from 'date-fns'

import prisma from '@/app/config/db/prisma'
import { formatUTC } from '@/app/utils/formatTrulyUTC'

export async function getMonitor() {
  const now = new Date()
  const startOfTodayLocal = startOfDay(now)
  const endOfTodayLocal = endOfDay(now)
  const data = await prisma.visita.findMany({
    where: {
      fechaCreacion: {
        gte: startOfTodayLocal,
        lte: endOfTodayLocal,
      },
    },
    include: {
      socio: {
        include: {
          plan: { orderBy: { fechamod: 'desc' }, include: { usuario: true, progreso: true } },
          sociomembresia: {
            include: {
              membresia: {
                select: {
                  Nombre: true,
                },
              },
            },
          },
        },
      },
    },
    distinct: ['idSocio'],
    orderBy: {
      fechaCreacion: 'desc',
    },
  })

  const formattedMonitor = data.map((item) => {
    const formattedPlan = item.socio?.plan?.find((e) => e.idPlan === item.socio?.idPlan)
    const formattedMembership = item.socio?.sociomembresia?.find((e) => e.idEstado === 1)?.membresia
      ?.Nombre
    const totalDias =
      formattedPlan?.dias && formattedPlan?.semanas ? formattedPlan.dias * formattedPlan.semanas : 0
    const porcentajeProgreso =
      totalDias > 0 ? Math.round(((formattedPlan?.progreso?.length ?? 0) / totalDias) * 100) : 0
    return {
      ...item,
      name: `${item.socio?.Nombre ?? ''} ${item.socio?.Paterno ?? ''}`,
      socio: {
        ...item.socio,
        huella: null,
        foto: null,
        plan: formattedPlan?.NombrePlan?.includes('SIN PLAN') ? null : formattedPlan,
        sociomembresia: formattedMembership,
      },
      porcentajeProgreso,
      precioVisita: null,
    }
  })

  return formattedMonitor
}

export async function getMonitorByPartner(idSocio: number) {
  const visita = await prisma.visita.findFirst({
    where: { idSocio: idSocio },
    orderBy: { fechaCreacion: 'desc' },
  })
  if (
    visita?.fechaCreacion &&
    isSameDay(startOfDay(formatUTC(new Date())), startOfDay(formatUTC(visita?.fechaCreacion)))
  )
    return visita
  else return null
}

export async function closeActivity(ids: number[]) {
  await prisma.visita.updateMany({
    where: { idVisita: { in: ids } },
    data: { horaFinalizacion: new Date() },
  })
}

export async function closeActivityByPartner(idSocio: number) {
  const ultimaVisita = await prisma.visita.findFirst({
    where: { idSocio: idSocio },
    orderBy: { fechaCreacion: 'desc' },
  })

  if (!ultimaVisita) {
    console.info('No se encontró ninguna visita para este socio.')
    return
  }

  await prisma.visita.update({
    where: { idVisita: ultimaVisita.idVisita },
    data: { horaFinalizacion: new Date() },
  })
}
