'use server'

import { $Enums, plan } from '@prisma/client'

import prisma from '@/app/config/db/prisma'
import { planSchmaType } from '@/app/schemas/plan'

import { getSessionSocio } from '..'

export async function getAllPlans() {
  const plans = await prisma.plan.findMany({
    include: { socio: { select: { Nombre: true, Paterno: true } } },
    orderBy: { idPlan: 'desc' },
  })

  return plans
}

export async function getPlansByPartner(id: number) {
  const plans = await prisma.plan.findMany({
    where: { idSocio: id },
    include: {
      socio: { select: { Nombre: true, Paterno: true, idPlan: true } },
      usuario: {
        select: { idUsuario: true, Nombre: true, idEstado: true },
      },
    },
    orderBy: { idPlan: 'desc' },
  })

  return plans
}

export async function getActivePlan(id: number) {
  const partner = await prisma.socio.findFirst({
    where: { idSocio: id },
    orderBy: { fechamod: 'desc' },
    include: { plan: { include: { usuario: { select: { Nombre: true, Telefono: true } } } } },
  })

  return partner?.plan?.find((e) => e.idPlan === partner.idPlan)
}

export async function getPlan() {
  const { idPlan } = await getSessionSocio()
  try {
    if (idPlan) {
      const data = await prisma.plan.findFirst({
        where: { idPlan: idPlan! },
        include: { usuario: { select: { Nombre: true, Telefono: true } } },
      })

      return data
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createPlan(data: planSchmaType) {
  const plan = await prisma.plan.create({
    data: {
      idSocio: parseInt(data.partnerId!),
      dias: data.dias,
      semanas: data.semanas,
      NombrePlan: data.NombrePlan,
      fechamod: new Date(),
      fechaCreacion: data.fechaCreacion,
      idUsuario: data.idUsuario ? parseInt(data.idUsuario) : undefined,
      type_of_training: data.type_of_training,
      teacher_comments: data.teacher_comments,
    },
  })
  return plan
}

export async function hasSameNamePlan(id: number, name: string) {
  const hasSameName = await prisma.plan.findFirst({ where: { idSocio: id, NombrePlan: name } })
  if (hasSameName) {
    return true
  } else {
    return false
  }
}

export async function copyPlan(id: number, data: planSchmaType) {
  const routine = await prisma.rutina_ejercicio.findMany({
    where: { idPlan: id },
  })
  const idSocio = data.partnerId
  const sameNamePlan = await prisma.plan.findFirst({
    where: { idSocio: Number(idSocio), NombrePlan: data.NombrePlan },
  })

  let plan: plan | null = null
  const dataPlan = {
    idSocio: Number(idSocio),
    dias: data.dias,
    semanas: data.semanas,
    NombrePlan: data.NombrePlan,
    fechamod: new Date(),
    fechaCreacion: data.fechaCreacion,
    idUsuario: data.idUsuario ? parseInt(data.idUsuario) : undefined,
    type_of_training: data.type_of_training,
    teacher_comments: data.teacher_comments,
  }
  if (sameNamePlan) {
    plan = await prisma.plan.update({
      where: {
        idPlan: sameNamePlan.idPlan,
      },
      data: dataPlan,
    })
    await prisma.rutina_ejercicio.deleteMany({
      where: { idPlan: sameNamePlan.idPlan },
    })
  } else {
    plan = await prisma.plan.create({
      data: dataPlan,
    })
  }
  const partner = await prisma.socio.update({
    where: { idSocio: parseInt(data.partnerId!) },
    data: { idPlan: plan.idPlan },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
      idSocio: true,
      idPlan: true,
      Telefono: true,
      Observaciones: true,
      plan: { orderBy: { fechaCreacion: 'desc' } },
    },
  })
  await Promise.all(
    routine.map((row) => {
      const idPlan = plan?.idPlan
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { idRutina, ...rest } = row
      return prisma.rutina_ejercicio.create({
        data: {
          ...rest,
          idPlan: idPlan!,
        },
      })
    })
  )
  return { partner, plan }
}

export async function deletePlan(id: number) {
  await prisma.plan.delete({
    where: {
      idPlan: id,
    },
  })
}

export async function updatePlan(id: number, data: planSchmaType) {
  await prisma.plan.update({
    where: {
      idPlan: id,
    },
    data: {
      idSocio: parseInt(data.partnerId!),
      dias: data.dias,
      semanas: data.semanas,
      NombrePlan: data.NombrePlan,
      fechaCreacion: data.fechaCreacion,
      fechamod: new Date(),
      idUsuario: data.idUsuario ? parseInt(data.idUsuario) : undefined,
      type_of_training: data.type_of_training,
      teacher_comments: data.teacher_comments,
    },
  })
}

export async function updatePlanComment(id: number, comments: string) {
  await prisma.plan.update({
    where: { idPlan: id },
    data: { comments },
  })
}

export async function updatePlanState(id: number, state: $Enums.state_of_training) {
  await prisma.plan.update({
    where: { idPlan: id },
    data: { state },
  })
}

export async function getPlanProgress(idPlan: number) {
  const planConProgreso = await prisma.plan.findUnique({
    where: { idPlan },
    include: {
      progreso: true,
    },
  })
  if (!planConProgreso) return { diasCompletados: [], totalDias: 0, porcentajeProgreso: 0 }

  const diasCompletados = planConProgreso.progreso.map((progresoDay) => progresoDay.dia)
  const totalDias =
    planConProgreso?.dias && planConProgreso?.semanas
      ? planConProgreso.dias * planConProgreso.semanas
      : 0
  const porcentajeProgreso =
    totalDias > 0 ? Math.round((diasCompletados.length / totalDias) * 100) : 0
  return { diasCompletados, totalDias, porcentajeProgreso }
}

export async function activePlan(idSocio: number, idPlan: number) {
  await prisma.socio.update({
    where: {
      idSocio,
    },
    data: {
      idPlan,
    },
  })
}

export async function FinishPlanDay({
  day,
  week,
  idPlan,
  idSocio,
}: {
  day: number
  week: number
  idPlan: number
  idSocio: number
}) {
  const plan = await prisma.plan.update({
    where: {
      idPlan: idPlan!,
    },
    data: {
      diaactual: day,
      semanaactual: week,
      fechamod: new Date(),
    },
  })
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
  const dias = plan.dias
  const accumulatedDay = (week - 1) * dias! + day
  const existingEntry = await prisma.plan_progreso.findUnique({
    where: {
      idPlan_dia: { idPlan, dia: accumulatedDay },
    },
  })

  if (existingEntry) {
    return
  }

  await prisma.plan_progreso.create({
    data: {
      idPlan,
      dia: accumulatedDay,
      completado: true,
      fecha: new Date(),
    },
  })

  const planConProgreso = await prisma.plan.findUnique({
    where: { idPlan },
    include: {
      progreso: true,
    },
  })

  const diasCompletados = planConProgreso?.progreso.map((progresoDay) => progresoDay.dia) || []
  const totalDias =
    planConProgreso?.dias && planConProgreso?.semanas
      ? planConProgreso.dias * planConProgreso.semanas
      : 0
  const porcentajeProgreso =
    totalDias > 0 ? Math.round((diasCompletados.length / totalDias) * 100) : 0

  if (porcentajeProgreso === 100) {
    await prisma.plan.update({
      where: {
        idPlan: idPlan,
      },
      data: {
        state: 'actualizar',
      },
    })
  }

  return porcentajeProgreso
}

export async function UnFinishPlanDay({ day, idPlan }: { day: number; idPlan: number }) {
  await prisma.plan_progreso.deleteMany({
    where: { idPlan, dia: day },
  })
}

export async function deActivePlan(idSocio: number) {
  await prisma.socio.update({
    where: {
      idSocio,
    },
    data: {
      idPlan: null,
    },
  })
}

export async function createPlanFeedback(planId: number, borg: $Enums.borg, comentario: string) {
  await prisma.plan_feedback.create({
    data: {
      planId,
      borg,
      comentario,
    },
  })
}

export async function getPlanResume(idPlan: number) {
  const plan = await prisma.plan.findUnique({
    where: { idPlan },
    include: {
      rutina_ejercicio: {
        where: {
          has_details: true,
        },
        include: {
          detalles: true,
          ejercicios: {
            include: {
              categoria_ej: true,
            },
          },
        },
      },
      plan_feedback: true,
    },
  })

  const progreso = await getPlanProgress(idPlan)

  return {
    ...plan,
    progreso,
  }
}
