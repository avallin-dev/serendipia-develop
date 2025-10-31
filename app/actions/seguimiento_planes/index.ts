'use server'

import { subWeeks } from 'date-fns'

import prisma from '@/app/config/db/prisma'

export async function getSociosConPlan() {
  const ultimasMembresias = await prisma.sociomembresia.findMany({
    where: {
      Vencimiento: {
        gt: subWeeks(new Date(), 1),
      },
      membresia: {
        Nombre: { contains: 'PLAN' },
        NOT: { Nombre: { contains: 'SIN PLAN' } },
      },
    },
    orderBy: {
      fechaCreacion: 'desc',
    },
    select: {
      idSocio: true,
      idSocioMembresia: true,
    },
    distinct: ['idSocio'],
  })

  const sociosConPlan = await prisma.socio.findMany({
    where: {
      idSocio: { gt: 10 },
      sociomembresia: {
        some: {
          idSocioMembresia: {
            in: ultimasMembresias.map((m) => m.idSocioMembresia),
          },
        },
      },
    },
    select: {
      Nombre: true,
      Paterno: true,
      Observaciones: true,
      condicionMedica: true,
      nivel: true,
      idPlan: true,
      grupoId: true,
      grupo: {
        select: {
          Nombre: true,
          Paterno: true,
        },
      },
      plan: {
        select: {
          idPlan: true,
          fechaCreacion: true,
          semanas: true,
          dias: true,
          type_of_training: true,
          progreso: true,
          usuario: {
            select: {
              Nombre: true,
            },
          },
          comments: true,
          state: true,
          NombrePlan: true,
        },
      },
    },
  })

  const formattedData = sociosConPlan
    .map((socio) => {
      const planActivo = socio.plan.find((plan) => plan.idPlan === socio.idPlan)
      const totalDias =
        planActivo?.dias && planActivo?.semanas ? planActivo.dias * planActivo.semanas : 0
      const porcentajeProgreso =
        totalDias > 0 ? Math.round(((planActivo?.progreso?.length ?? 0) / totalDias) * 100) : 0
      return {
        nombreSocio: `${socio.Nombre} ${socio.Paterno}`,
        observaciones: socio.Observaciones,
        condicionMedica: socio.condicionMedica || '',
        nivel: socio.nivel || 'Desconocido',
        grupo: socio.grupo ? `${socio.grupo.Nombre}` : 'Sin grupo',
        profesor: planActivo?.usuario?.Nombre || 'Desconocido',
        fechaInicio: planActivo?.fechaCreacion || null,
        fechaFin: planActivo?.fechaCreacion
          ? new Date(
              planActivo.fechaCreacion.getTime() +
                (planActivo.semanas || 0) * 7 * 24 * 60 * 60 * 1000
            )
          : null,
        semanas: planActivo?.semanas || 0,
        dias: planActivo?.dias || 0,
        shouldChangePlan: porcentajeProgreso >= 100,
        progreso: porcentajeProgreso,
        type_of_training: planActivo?.type_of_training,
        comments: planActivo?.comments || '',
        state: planActivo?.state || 'actualizar',
        idPlan: socio.idPlan,
        nombrePlan: planActivo?.NombrePlan || 'Desconocido',
      }
    })
    .sort((a, b) => {
      if (a.shouldChangePlan && !b.shouldChangePlan) return -1
      if (!a.shouldChangePlan && b.shouldChangePlan) return 1
      if (a.state === 'actualizar' && b.state !== 'actualizar') return -1
      if (a.state !== 'actualizar' && b.state === 'actualizar') return 1
      return 0
    })

  return formattedData
}
