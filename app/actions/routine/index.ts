'use server'

import type { $Enums, borg } from '@prisma/client'

import prisma from '@/app/config/db/prisma'
import { routineSchmaType } from '@/app/schemas/routine'

export async function getAllRoutines() {
  const data = await prisma.rutina_ejercicio.findMany({
    orderBy: { idRutina: 'desc' },
    include: {
      ejercicios: true,
      plan: true,
    },
  })

  return data
}

export async function getAllRoutinesByPlan(id: number | null) {
  if (id) {
    const data = await prisma.rutina_ejercicio.findMany({
      where: {
        idPlan: id!,
      },
      include: {
        ejercicios: {
          include: {
            categoria_ej: true,
          },
        },
        detalles: true,
      },
      orderBy: [{ dia: 'asc' }, { nroEjercicio: 'asc' }],
    })

    return data
  } else {
    return null
  }
}

export async function getRoutinesByPlanAndWeek(id: number | null, week: number) {
  if (id) {
    const data = await prisma.rutina_ejercicio.findMany({
      where: {
        idPlan: id!,
      },
      include: {
        partner_comment: { where: { week } },
        ejercicios: {
          include: {
            categoria_ej: true,
          },
        },
        detalles: true,
      },
      orderBy: [{ dia: 'asc' }, { nroEjercicio: 'asc' }],
    })

    return data
  } else {
    return null
  }
}

export async function getRoutineByPlanAndWeek(routineId: number | null, week: number) {
  if (routineId) {
    const data = await prisma.partner_comment.findFirst({
      where: {
        routineId: routineId,
        week,
      },
    })

    return data
  } else {
    return null
  }
}

export async function createRoutine(data: routineSchmaType) {
  if (!data.idPlan) {
    const plan = await prisma.plan.findFirst({ where: { idPlan: parseInt(data.idPlan) } })
    if (plan?.dias && data.dia > plan?.dias) {
      throw new Error(`El número de dias no puede ser mayor a ${plan?.dias}`)
    }
  }

  const routine = await prisma.rutina_ejercicio.create({
    data: {
      ...data,
      idPlan: parseInt(data.idPlan),
      idEjercicio: parseInt(data.idEjercicio),
      detalles: undefined,
    },
  })

  if (data.has_details && data.detalles && data.detalles.length > 0) {
    const detallesPlanos = data.detalles.flatMap((semana) =>
      semana.series.map((serie) => ({
        ...serie,
        semana: semana.semana,
        rutinaEjercicioId: routine.idRutina,
        rpe:
          serie.rpe &&
          [
            'ZERO',
            'ONE',
            'TWO',
            'THREE',
            'FOUR',
            'FIVE',
            'SIX',
            'SEVEN',
            'EIGHT',
            'NINE',
            'TEN',
          ].includes(serie.rpe.toUpperCase())
            ? (serie.rpe.toUpperCase() as borg)
            : null,
      }))
    )
    await prisma.rutina_ejercicio_detalle.createMany({
      data: detallesPlanos,
    })
  }
}

export async function deleteRoutine(id: number) {
  await prisma.rutina_ejercicio.delete({
    where: {
      idRutina: id,
    },
  })
}

export async function updateRoutine(id: number, data: routineSchmaType) {
  await prisma.rutina_ejercicio.update({
    where: {
      idRutina: id,
    },
    data: {
      ...data,
      idPlan: parseInt(data.idPlan),
      idEjercicio: parseInt(data.idEjercicio),
      detalles: undefined,
    },
  })

  if (data.has_details && data.detalles && data.detalles.length > 0) {
    await prisma.rutina_ejercicio_detalle.deleteMany({
      where: { rutinaEjercicioId: id },
    })
    const detallesPlanos = data.detalles.flatMap((semana) =>
      semana.series.map((serie) => ({
        ...serie,
        semana: semana.semana,
        rutinaEjercicioId: id,
        rpe:
          serie.rpe &&
          [
            'ZERO',
            'ONE',
            'TWO',
            'THREE',
            'FOUR',
            'FIVE',
            'SIX',
            'SEVEN',
            'EIGHT',
            'NINE',
            'TEN',
          ].includes(serie.rpe.toUpperCase())
            ? (serie.rpe.toUpperCase() as borg)
            : null,
      }))
    )
    await prisma.rutina_ejercicio_detalle.createMany({
      data: detallesPlanos,
    })
  }
}

export async function submitUpdateComment({
  routineId,
  comment,
  week,
}: {
  routineId: number
  comment: string
  week: number
}) {
  const routine_week = await prisma.partner_comment.findFirst({
    where: {
      routineId,
      week,
    },
  })
  if (routine_week) {
    await prisma.partner_comment.update({
      where: {
        id: routine_week.id,
      },
      data: {
        comment,
      },
    })
  } else {
    await prisma.partner_comment.create({
      data: {
        routineId,
        comment,
        week,
      },
    })
  }
}

export async function updateRoutineFeedback(
  routineDetalleId: number,
  borg: $Enums.borg,
  comentario: string
) {
  await prisma.rutina_ejercicio_detalle.update({
    where: {
      id: routineDetalleId,
    },
    data: {
      rpe: borg,
      comentario,
    },
  })
}
