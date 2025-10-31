'use server'

import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns'

import { getSociosConPlan } from '@/app/actions/seguimiento_planes'
import prisma from '@/app/config/db/prisma'
import { formatUTC } from '@/app/utils/formatTrulyUTC'
export async function getConcurrencia({ from }: { from: Date; to: Date }) {
  const visitas = await prisma.visita.findMany({
    where: {
      fechaCreacion: {
        gte: startOfDay(from),
        lte: endOfDay(from),
      },
    },
    select: {
      fechaCreacion: true,
      horaFinalizacion: true,
      socio: {
        select: {
          idSocio: true,
          Nombre: true,
          Paterno: true,
          Materno: true,
          sociomembresia: {
            where: {
              Vencimiento: { gte: new Date() },
            },
            select: {
              membresia: {
                select: {
                  Nombre: true,
                },
              },
            },
            take: 1,
            orderBy: { Vencimiento: 'desc' },
          },
        },
      },
    },
    distinct: ['idSocio'],
    orderBy: {
      fechaCreacion: 'desc',
    },
  })
  const concurrencia: Record<string, Record<number, number>> = {}

  visitas.forEach(({ fechaCreacion, horaFinalizacion }) => {
    const start = new Date(fechaCreacion!)
    // Usar formatUTC para la hora de finalización si existe
    const end = horaFinalizacion ? formatUTC(new Date(horaFinalizacion)) : new Date()
    const current = new Date(start)
    while (current <= end) {
      const dia = current.toISOString().slice(0, 10) // YYYY-MM-DD
      const hora = current.getHours()
      concurrencia[dia] = concurrencia[dia] || {}
      concurrencia[dia][hora] = (concurrencia[dia][hora] || 0) + 1
      current.setHours(current.getHours() + 1)
    }
  })

  const visitasExport = visitas.map((v) => {
    const socio = v.socio
    const membresia = socio?.sociomembresia?.[0]?.membresia?.Nombre || ''
    return {
      nombre: [socio?.Nombre, socio?.Paterno].filter(Boolean).join(' '),
      membresia,
      fechaCreacion: v.fechaCreacion ? new Date(v.fechaCreacion).toISOString() : '',
      horaFinalizacion: v.horaFinalizacion
        ? formatUTC(new Date(v.horaFinalizacion)).toISOString()
        : '',
    }
  })

  return { concurrencia, visitasExport }
}

export async function getHistorialPagos({ from, to }: { from: Date; to: Date }) {
  const pagos = await prisma.sociomembresia_pago.findMany({
    where: {
      fecha: { gte: startOfDay(from), lte: endOfDay(to) },
      importe: { gt: 0 },
    },
    include: {
      sociomembresia: {
        include: {
          socio: true,
          membresia: true,
        },
      },
    },
  })
  return pagos.map((pago) => ({
    fecha: pago.fecha ? new Date(pago.fecha).toISOString() : '',
    alumno: [pago.sociomembresia?.socio?.Nombre, pago.sociomembresia?.socio?.Paterno]
      .filter(Boolean)
      .join(' '),
    monto: pago.importe ? Number(pago.importe) : null,
    membresia: pago.sociomembresia?.membresia?.Nombre ?? '',
    comentario: pago.observacion ?? '',
  }))
}

export async function getHistorialCheckins({ from, to }: { from: Date; to: Date }) {
  try {
    const checkins = await prisma.socio.findMany({
      where: {
        fechamod: { gte: startOfDay(from), lte: endOfDay(to) },
      },
    })
    return checkins
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getHistorialVisitantes({ from, to }: { from: Date; to: Date }) {
  const visitantes = await prisma.visita.findMany({
    where: {
      fechaCreacion: { gte: startOfDay(from), lte: endOfDay(to) },
    },
  })
  return visitantes.map((v) => ({
    ...v,
    precioVisita: v.precioVisita ? Number(v.precioVisita) : null,
  }))
}

export async function getExportIndicators() {
  const now = new Date()
  const from = startOfMonth(subMonths(now, 5))
  const to = endOfMonth(now)

  const [pagos, checkins, visitantes, concurrencia] = await Promise.all([
    getHistorialPagos({ from, to }),
    getHistorialCheckins({ from, to }),
    getHistorialVisitantes({ from, to }),
    getConcurrencia({ from, to }),
  ])

  return { pagos, checkins, visitantes, concurrencia }
}

export async function getExpiredMembershipsPie(
  filtro: 'con_plan' | 'sin_plan' | 'todos' = 'todos',
  { from, to }: { from: Date; to: Date }
) {
  const alumnosVigentesMesVencido = await prisma.sociomembresia.findMany({
    where: {
      idEstado: 1,
      fechaInicioMembresia: { gte: from, lte: to },
      socio:
        filtro === 'con_plan'
          ? { idPlan: { not: null } }
          : filtro === 'sin_plan'
          ? { idPlan: null }
          : undefined,
    },
    include: {
      membresia: true,
      socio: true,
    },
  })

  let sala = 0
  let pilates = 0
  alumnosVigentesMesVencido.forEach((sm) => {
    const nombre = sm.membresia?.Nombre?.toLowerCase() || ''
    if (nombre.includes('pilates')) pilates++
    else sala++
  })
  return { sala, pilates }
}

export async function getStudentsByMembership({ from, to }: { from: Date; to: Date }) {
  const activas = await prisma.sociomembresia.findMany({
    where: {
      idEstado: 1,
      fechaInicioMembresia: { gte: from, lte: to },
    },
    include: {
      membresia: true,
      socio: true,
    },
  })

  const sociosMap = new Map()
  activas.forEach((sm) => {
    const idSocio = sm.socio?.idSocio
    if (!idSocio) return
    if (
      !sociosMap.has(idSocio) ||
      (sm.Vencimiento &&
        sociosMap.get(idSocio).Vencimiento &&
        new Date(sm.Vencimiento) > new Date(sociosMap.get(idSocio).Vencimiento))
    ) {
      sociosMap.set(idSocio, sm)
    }
  })
  const activasFiltradas = Array.from(sociosMap.values())

  const conteo: Record<
    string,
    { alumnos: string[]; vencimientos: string[]; amounts: number[]; apellido: string[] }
  > = {}
  activasFiltradas.forEach((sm) => {
    const nombre = sm.membresia?.Nombre || 'Sin nombre'
    const alumnoNombre = sm.socio?.Nombre || 'Desconocido'
    const apellido = sm.socio?.Paterno || ''
    const vencimiento = sm.Vencimiento ? sm.Vencimiento.toISOString().split('T')[0] : ''
    const monto = sm.Precio ? Number(sm.Precio) : 0
    if (!conteo[nombre]) {
      conteo[nombre] = { alumnos: [], vencimientos: [], amounts: [], apellido: [] }
    }
    conteo[nombre].alumnos.push(alumnoNombre)
    conteo[nombre].vencimientos.push(vencimiento)
    conteo[nombre].amounts.push(monto)
    conteo[nombre].apellido.push(apellido)
  })
  return Object.entries(conteo).flatMap(([nombre, { alumnos, vencimientos, amounts, apellido }]) =>
    alumnos.map((alumno, index) => ({
      Fecha: vencimientos[index],
      Alumno: alumno,
      Apellido: apellido[index],
      Monto: amounts[index],
      Membresía: nombre,
      Comentario: '',
    }))
  )
}

export async function getFacturationByType({ from, to }: { from: Date; to: Date }) {
  const pagos = await prisma.sociomembresia_pago.findMany({
    where: {
      fecha: { gte: from, lte: to },
    },
    include: {
      sociomembresia: { include: { membresia: true } },
    },
  })
  let sala = 0
  let pilates = 0
  pagos.forEach((pago) => {
    const nombre = pago.sociomembresia?.membresia?.Nombre?.toLowerCase() || ''
    const importe = pago.importe ? Number(pago.importe) : 0
    if (nombre.includes('pilates')) pilates += importe
    else sala += importe
  })
  return { sala, pilates }
}

export async function getFacturationByMembership({ from, to }: { from: Date; to: Date }) {
  const pagos = await prisma.sociomembresia_pago.findMany({
    where: {
      fecha: { gte: from, lte: to },
    },
    include: {
      sociomembresia: { include: { membresia: true } },
    },
  })
  const totales: Record<string, number> = {}
  let totalGlobal = 0
  pagos.forEach((pago) => {
    const nombre = pago.sociomembresia?.membresia?.Nombre || 'Sin nombre'
    const importe = pago.importe ? Number(pago.importe) : 0
    totales[nombre] = (totales[nombre] || 0) + importe
    totalGlobal += importe
  })
  return Object.entries(totales).map(([nombre, total]) => ({
    nombre,
    total,
    porcentaje: totalGlobal > 0 ? (total / totalGlobal) * 100 : 0,
  }))
}

export async function getPendingFacturation() {
  const now = new Date()
  const startMesActual = startOfMonth(now)
  const endMesActual = endOfMonth(now)
  const startMesAnterior = startOfMonth(subMonths(now, 1))
  const endMesAnterior = endOfMonth(subMonths(now, 1))
  const pagosActual = await prisma.sociomembresia_pago.aggregate({
    _sum: { importe: true },
    where: { fecha: { gte: startMesActual, lte: endMesActual } },
  })
  const pagosAnterior = await prisma.sociomembresia_pago.aggregate({
    _sum: { importe: true },
    where: { fecha: { gte: startMesAnterior, lte: endMesAnterior } },
  })
  const actual = pagosActual._sum.importe || 0
  const anterior = pagosAnterior._sum.importe || 0
  const porcentaje =
    Number(anterior) > 0 ? ((Number(actual) - Number(anterior)) / Number(anterior)) * 100 : 0
  return { actual, anterior, porcentaje }
}

export async function getAverageMembershipValue({ from, to }: { from: Date; to: Date }) {
  const socios = await prisma.sociomembresia.findMany({
    where: {
      Precio: { not: null },
      fechaCreacion: { gte: from, lte: to },
    },
    select: { Precio: true },
  })
  if (socios.length === 0) return 0
  const total = socios.reduce((acc, s) => acc + Number(s.Precio), 0)
  return total / socios.length
}

export async function getBankVsCash({ from, to }: { from: Date; to: Date }) {
  const efectivoRes = await prisma.sociomembresia_pago.aggregate({
    _sum: { importe: true },
    where: {
      fecha: { gte: from, lte: to },
      sociomembresia: {
        membresia: {
          OR: [
            {
              Nombre: {
                contains: 'EFECTIVO',
              },
            },
            {
              Nombre: {
                contains: 'EFVO',
              },
            },
          ],
        },
      },
    },
  })
  const bancoRes = await prisma.sociomembresia_pago.aggregate({
    _sum: { importe: true },
    where: {
      fecha: { gte: from, lte: to },
      sociomembresia: {
        membresia: {
          NOT: [
            {
              Nombre: {
                contains: 'EFECTIVO',
              },
            },
            {
              Nombre: {
                contains: 'EFVO',
              },
            },
          ],
        },
      },
    },
  })
  return {
    banco: bancoRes._sum.importe ? Number(bancoRes._sum.importe) : 0,
    efectivo: efectivoRes._sum.importe ? Number(efectivoRes._sum.importe) : 0,
  }
}

export async function getPlansByTrainer() {
  return await getSociosConPlan()
}
