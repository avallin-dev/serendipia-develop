// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use server'

import prisma from '@/app/config/db/prisma'
import { membershipSchmaType } from '@/app/schemas/membership'
import createDateWithTime from '@/app/utils/createDateWithTime'
export type GetAllMembershipsType = typeof getAllMemberships

export async function getAllMemberships() {
  const memberships = await prisma.membresia.findMany()

  memberships.forEach((item) => {
    item.Precio = item.Precio?.toNumber()
  })

  return memberships
}

export async function getMembership(id: number) {
  const membership = await prisma.membresia.findFirst({ where: { idMembreia: id } })

  return membership
}

export async function getPartnerMembership(id: number) {
  const data = await prisma.sociomembresia.findFirst({ where: { idSocio: id } })

  return data
}

export async function createMembership(data: membershipSchmaType) {
  const finalHour = data.horaFinal ? createDateWithTime(data.horaFinal) : null
  const startHour = data.horaInicio ? createDateWithTime(data.horaInicio) : null
  await prisma.membresia.create({
    data: {
      idEstado: 1,
      fechaCreacion: new Date(),
      idTipoMembresia: parseInt(data.idTipoMembresia!),
      horaFinal: finalHour,
      horaInicio: startHour,
      Nombre: data.Nombre,
      Precio: data.Precio,
      meses: data.meses,
      semanas: data.meses,
      dias: data.meses,
    },
  })
}

export async function deleteMembership(id: number) {
  await prisma.membresia.delete({
    where: {
      idMembresia: id,
    },
  })
}

export async function updateMembership(id: number, data: membershipSchmaType) {
  const finalHour = data.horaFinal ? createDateWithTime(data.horaFinal) : null
  const startHour = data.horaInicio ? createDateWithTime(data.horaInicio) : null
  await prisma.membresia.update({
    where: {
      idMembresia: id,
    },
    data: {
      ...data,
      horaFinal: finalHour,
      horaInicio: startHour,
      Precio: data.Precio,
      idTipoMembresia: parseInt(data.idTipoMembresia),
    },
  })
}

type usePayMembershipDataType = {
  importe: number
  observacion?: string
  idSocioMembresia: number
}
export async function payMembership(id: number, data: usePayMembershipDataType) {
  await prisma.sociomembresia_pago.create({
    data: {
      ...data,
      fecha: new Date(),
      idEstado: 1,
    },
  })
  await prisma.sociomembresia.updateMany({
    where: {
      idSocio: id,
      NOT: {
        idSocioMembresia: data.idSocioMembresia,
      },
    },
    data: {
      idEstado: 2,
    },
  })
  await prisma.sociomembresia.update({
    where: {
      idSocioMembresia: data.idSocioMembresia,
    },
    data: {
      estadoMembresia: 'Pagada',
      idEstado: 1,
    },
  })
}

export async function updatePayMembership(
  idSocioMembresia: number,
  data: usePayMembershipDataType
) {
  const lastPayment = await prisma.sociomembresia_pago.findFirst({
    where: { idSocioMembresia },
    orderBy: { fecha: 'desc' },
  })

  if (!lastPayment) {
    throw new Error('No se encontró un pago para actualizar.')
  }

  await prisma.sociomembresia_pago.update({
    where: {
      id: lastPayment.id,
    },
    data: {
      ...data,
      fecha: new Date(),
      idEstado: 1,
    },
  })
  await prisma.sociomembresia.update({
    where: {
      idSocioMembresia: data.idSocioMembresia,
    },
    data: {
      estadoMembresia: 'Pagada',
      idEstado: 1,
    },
  })
}

export async function getPayMembership(id: number) {
  const data = await prisma.sociomembresia_pago.findFirst({
    where: { idSocioMembresia: id },
    orderBy: { fecha: 'desc' },
  })

  return data
}

export async function getMembershipPayments(idSocio: number) {
  const data = await prisma.sociomembresia.findMany({
    where: { idSocio },
    include: { sociomembresia_pago: { orderBy: { fecha: 'desc' } }, membresia: true },
    orderBy: { idSocioMembresia: 'desc' },
  })

  const formattedPartnerMembership = data.flatMap(
    ({ membresia, estadoMembresia, sociomembresia_pago }) =>
      sociomembresia_pago.map((detalle) => ({
        name: membresia?.Nombre ?? '',
        estadoMembresia: estadoMembresia,
        ...detalle,
      }))
  )

  return formattedPartnerMembership
}

export async function getAllSociomemberships() {
  return await prisma.sociomembresia
    .findMany({
      include: {
        membresia: true,
        socio: true,
      },
      orderBy: { Vencimiento: 'asc' },
    })
    .then((data) =>
      data.map((m) => ({
        ...m,
        Precio: m.Precio ? Number(m.Precio) : null,
        membresia: m.membresia
          ? {
              ...m.membresia,
              Precio: m.membresia.Precio ? Number(m.membresia.Precio) : null,
            }
          : null,
      }))
    )
}
