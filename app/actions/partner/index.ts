'use server'

import type { socio, sociomembresia } from '@prisma/client'
import { differenceInWeeks, endOfWeek, startOfWeek } from 'date-fns'

import prisma from '@/app/config/db/prisma'
import { pilateFullSchmaType } from '@/app/schemas/pilate'
import { getUserIdFromToken } from '@/app/utils/auth'

import { createFullPilate } from '../pilate'

export type PartnerByIdType = {
  Nombre: string | null
  Paterno: string | null
  DNI: string | null
}
export async function getPartnerById(id: number) {
  const partner = await prisma.socio.findFirst({
    where: {
      idSocio: id,
    },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
    },
  })

  return partner
}

export async function getPartnerByDNI(dni: string) {
  const exist = await prisma.socio.findFirst({
    where: {
      DNI: dni,
    },
  })

  return !!exist
}

export async function getAllPartners() {
  const data = await prisma.socio.findMany({
    where: {
      idSocio: { gte: 1000 },
      idEstado: 1,
    },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
      idSocio: true,
      Telefono: true,
      Observaciones: true,
      plan: { orderBy: { fechaCreacion: 'desc' } },
    },
  })

  return data
}

export async function getPartners() {
  const data = await prisma.socio.findMany({
    // where: {
    //   idEstado: 1,
    // },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
      idSocio: true,
      Telefono: true,
      Observaciones: true,
      usuario: true,
      idPlan: true,
      plan: { orderBy: { fechaCreacion: 'desc' } },
    },
    orderBy: { idSocio: 'asc' },
  })

  return data
}

export async function getPartnersByType(type: string) {
  let idSocioFilter = {}

  if (type === 'bloque') {
    idSocioFilter = { lte: 500 }
  } else if (type === 'grupo') {
    idSocioFilter = {
      gt: 500,
      lt: 1000,
    }
  } else if (type === 'socio') {
    idSocioFilter = { gte: 1000 }
  }

  const data = await prisma.socio.findMany({
    where: {
      idEstado: 1,
      idSocio: idSocioFilter,
    },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
      idSocio: true,
      Telefono: true,
      Observaciones: true,
      usuario: true,
      idPlan: true,
      plan: { orderBy: { fechaCreacion: 'desc' } },
      grupoId: true,
      grupo: true,
      miembros: true,
    },
    orderBy: { idSocio: 'asc' },
  })

  return data
}

export async function getFullPartnerById(id: number) {
  const partner = await prisma.socio.findFirst({
    where: {
      idSocio: id,
    },
    include: {
      plan: { where: { idSocio: id }, take: 1, orderBy: { fechaCreacion: 'desc' } },
      sociomembresia: { orderBy: { fechaCreacion: 'desc' } },
    },
  })

  return { ...partner, idPlan: partner?.plan[0]?.NombrePlan }
}

export async function createPartner(data: Partial<socio>, type?: 'bloque' | 'grupo' | 'socio') {
  const { idSocio, ...rest } = data

  let newIdSocio = idSocio

  if (!newIdSocio) {
    let min = 1000,
      max = 999999
    if (type === 'bloque') {
      min = 0
      max = 500
    } else if (type === 'grupo') {
      min = 501
      max = 999
    }

    const last = await prisma.socio.findFirst({
      where: { idSocio: { gte: min, lte: max } },
      orderBy: { idSocio: 'desc' },
    })

    newIdSocio = last ? last.idSocio + 1 : min
  }

  const res = await prisma.socio.create({
    data: {
      idSocio: newIdSocio,
      idEstado: 1,
      fechamod: new Date(),
      fechaCreacion: new Date(),
      blog: false,
      ...rest,
    },
  })

  return res.idSocio
}

export async function deletePartner(id: number) {
  await prisma.socio.delete({
    where: {
      idSocio: id,
    },
  })
}

export async function deletePartnerPic(id: number) {
  await prisma.socio.update({
    where: {
      idSocio: id,
    },
    data: { image_profile: null },
  })
}

export async function updatePartner(id: number, data: Partial<socio>) {
  await prisma.socio.update({
    where: {
      idSocio: id,
    },
    data: {
      fechamod: new Date(),
      ...data,
    },
  })
}

export type getMembershipsByPartnerType = typeof getMembershipsByPartner
export async function getMembershipsByPartner(id: number) {
  const data = await prisma.sociomembresia.findMany({
    where: {
      idSocio: id,
    },
    include: { membresia: true, sociomembresia_pago: true },
    orderBy: [
      {
        fechaCreacion: 'desc',
      },
    ],
    take: 1,
  })
  return data
}

export async function createPartnerMembership(id: number, data: Partial<sociomembresia>) {
  const membership = await prisma.membresia.findFirst({
    where: { idMembresia: data.idMembresia! },
  })
  if (!membership) throw new Error('Membresía no encontrada')

  const pilatesRegex = /(\d+)\s*PILATES|PILATES\s*(\d+)/i
  const match = membership.Nombre?.match(pilatesRegex)
  const pilatesClasses = match ? parseInt(match[1] || match[2]) : 0

  const newMembership = await prisma.sociomembresia.create({
    data: {
      ...data,
      idEstado: 2,
      idSocio: id,
      fechaCreacion: new Date(),
      Precio: membership?.Precio,
      estadoMembresia: 'Sin_pagar',
      meses: membership?.meses,
      semanas: membership?.semanas,
      dias: membership?.dias,
      idTipoMembresia: membership?.idTipoMembresia,
    },
  })

  if (pilatesClasses > 0 && data.fechaInicioMembresia && data.Vencimiento) {
    const weeks = differenceInWeeks(new Date(data.Vencimiento), new Date(data.fechaInicioMembresia))
    const totalPilatesClasses = weeks * pilatesClasses

    await prisma.pilates_disponibles.create({
      data: {
        idSocioMembresia: newMembership.idSocioMembresia,
        clases_disponibles: totalPilatesClasses,
      },
    })
  }
}

export async function updatePartnerMembership(id: number, data: Partial<sociomembresia>) {
  const membership = await prisma.membresia.findFirst({
    where: { idMembresia: data.idMembresia! },
  })
  if (!membership) throw new Error('Membresía no encontrada')
  const pilatesRegex = /(\d+)\s*PILATES|PILATES\s*(\d+)/i
  const match = membership.Nombre?.match(pilatesRegex)
  const pilatesClasses = match ? parseInt(match[1] || match[2]) : 0
  await prisma.sociomembresia.update({
    where: {
      idSocioMembresia: id,
    },
    data: {
      ...data,
      estadoMembresia: 'Sin_pagar',
      Precio: membership?.Precio,
      meses: membership?.meses,
      semanas: membership?.semanas,
      dias: membership?.dias,
      idTipoMembresia: membership?.idTipoMembresia,
    },
  })

  if (pilatesClasses && data.fechaInicioMembresia && data.Vencimiento) {
    const weeks = differenceInWeeks(new Date(data.Vencimiento), new Date(data.fechaInicioMembresia))
    const totalPilatesClasses = weeks * pilatesClasses
    const pilates_disponibles = await prisma.pilates_disponibles.findFirst({
      where: { idSocioMembresia: id },
    })
    if (pilates_disponibles) {
      await prisma.pilates_disponibles.update({
        where: { idSocioMembresia: id },
        data: {
          clases_disponibles: totalPilatesClasses,
        },
      })
    } else {
      await prisma.pilates_disponibles.create({
        data: {
          idSocioMembresia: id,
          clases_disponibles: totalPilatesClasses,
        },
      })
    }
  }
}

export async function deletePartnerMembership(id: number) {
  await prisma.sociomembresia.delete({
    where: {
      idSocioMembresia: id,
    },
  })
}

export async function renewPartnerMembership(
  idSocioMembresia: number,
  data: Partial<sociomembresia>
) {
  const sociomembresiaUpdated = await prisma.sociomembresia.update({
    where: {
      idSocioMembresia,
    },
    data: {
      fechaInicioMembresia: data.fechaInicioMembresia,
      Vencimiento: data.Vencimiento,
    },
    include: { sociomembresiaPilates: true },
  })
  if (sociomembresiaUpdated.sociomembresiaPilates.length > 0) {
    await prisma.pilates_disponibles.update({
      where: { idSocioMembresia },
      data: {
        clases_ocupadas: 0,
      },
    })
    const schema: pilateFullSchmaType = {
      idSocio: sociomembresiaUpdated.idSocio?.toString() ?? '',
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
    sociomembresiaUpdated.sociomembresiaPilates.forEach((c, index) => {
      if (index < 5) {
        schema[`class${index + 1}Day` as keyof pilateFullSchmaType] = c.day
        schema[`class${index + 1}Time` as keyof pilateFullSchmaType] = c.time
      }
    })
    await createFullPilate(schema)
  }
}

export async function getMembershipsWithPilates() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    sociomembresia: {
      some: {
        idEstado: 1,
        membresia: {
          Nombre: {
            contains: 'PILATES',
          },
        },
      },
    },
  }
  const data = await prisma.socio.findMany({
    where: whereClause,
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
          sociomembresiaPilates: true,
        },
      },
      pilates: {
        where: {
          start: {
            gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
            lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
          },
        },
      },
    },
  })

  const formattedPilate = data
    .map((item) => {
      const formattedMembresia = item.sociomembresia.map((membresia) => {
        const clasesRestantes =
          (membresia.pilates_disponibles?.clases_disponibles ?? 0) -
          (membresia.pilates_disponibles?.clases_ocupadas ?? 0)
        const pilatesNameString = membresia?.membresia?.Nombre
        const regex = /(\d+)\s*PILATES|PILATES\s*(\d+)/i
        const match = pilatesNameString?.match(regex)
        const numero_de_clases = match ? parseInt(match[1] || match[2]) : 0
        return {
          ...membresia,
          Precio: null,
          clases_restantes: clasesRestantes,
          numero_de_clases: numero_de_clases,
          membresia: {
            ...membresia.membresia,
            Precio: null,
          },
        }
      })

      return {
        ...item,
        sociomembresia: formattedMembresia,
        huella: null,
        foto: null,
      }
    })
    .filter((m) => m.sociomembresia.length > 0)

  return formattedPilate
}

export async function typeMembership() {
  const idSocio = await getUserIdFromToken()
  const membership = await prisma.sociomembresia.findFirst({
    where: {
      idSocio: idSocio,
      idEstado: 1,
    },
    select: {
      socio: { select: { clave: true, idPlan: true, image_profile: true } },
      membresia: { select: { Nombre: true } },
    },
  })

  if (!membership || !membership.socio?.image_profile) {
    return {
      socio: { clave: '0', idPlan: null, image_profile: null },
      membresia: { Nombre: null },
    }
  }

  return membership
}

export async function updateImageProfile(data: string) {
  const idSocio = await getUserIdFromToken()
  await prisma.socio.update({
    where: {
      idSocio: idSocio!,
    },
    data: {
      image_profile: data,
    },
  })
}

export async function addMember(id: number, data: { idSocio: number }) {
  // Obtener el plan activo del grupo
  const grupoIdPlan = await prisma.socio.findFirst({
    where: { idSocio: id },
    select: { idPlan: true },
  })

  if (!grupoIdPlan?.idPlan) {
    throw new Error('El grupo no tiene un plan activo')
  }

  const grupo = await prisma.socio.findFirst({
    where: { idSocio: id },
    include: { plan: { where: { idPlan: { equals: grupoIdPlan?.idPlan } } } },
  })

  if (!grupo?.plan[0]) {
    throw new Error('El grupo no tiene un plan activo')
  }

  // Copiar el plan al nuevo miembro
  const planActivo = grupo.plan[0]
  const nuevoPlan = await prisma.plan.create({
    data: {
      idSocio: data.idSocio,
      dias: planActivo.dias,
      semanas: planActivo.semanas,
      NombrePlan: planActivo.NombrePlan,
      fechamod: new Date(),
      fechaCreacion: new Date(),
      idUsuario: planActivo.idUsuario,
      type_of_training: planActivo.type_of_training,
    },
  })

  // Copiar las rutinas de ejercicios
  const rutinas = await prisma.rutina_ejercicio.findMany({
    where: { idPlan: planActivo.idPlan },
  })

  await Promise.all(
    rutinas.map((rutina) => {
      const { idRutina: _idRutina, ...rest } = rutina
      return prisma.rutina_ejercicio.create({
        data: {
          ...rest,
          idPlan: nuevoPlan.idPlan,
        },
      })
    })
  )

  // Actualizar el socio con el nuevo plan y asignarlo al grupo
  await prisma.socio.update({
    where: { idSocio: data.idSocio },
    data: {
      idPlan: nuevoPlan.idPlan,
      grupoId: id,
    },
  })

  // Obtener y devolver el socio actualizado con la misma estructura que getPartnersByType
  const socioActualizado = await prisma.socio.findFirst({
    where: { idSocio: data.idSocio },
    select: {
      DNI: true,
      Nombre: true,
      Paterno: true,
      idSocio: true,
      Telefono: true,
      Observaciones: true,
      usuario: true,
      idPlan: true,
      plan: { orderBy: { fechaCreacion: 'desc' } },
      grupoId: true,
      grupo: true,
      miembros: true,
    },
  })

  return socioActualizado
}

export async function removeMember(idSocio: number) {
  // Obtener el socio y su plan actual
  const socio = await prisma.socio.findFirst({
    where: { idSocio },
    include: { plan: true },
  })

  if (!socio) {
    throw new Error('Socio no encontrado')
  }

  // Eliminar las rutinas de ejercicios asociadas al plan
  if (socio.plan.length > 0) {
    await prisma.rutina_ejercicio.deleteMany({
      where: { idPlan: socio.plan[0].idPlan },
    })

    // Eliminar el plan
    await prisma.plan.delete({
      where: { idPlan: socio.plan[0].idPlan },
    })
  }

  // Actualizar el socio eliminando la relación con el grupo y el plan
  await prisma.socio.update({
    where: { idSocio },
    data: {
      grupoId: null,
      idPlan: null,
    },
  })
}
