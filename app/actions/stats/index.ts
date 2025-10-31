'use server'

import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

import prisma from '@/app/config/db/prisma'

export async function getMembershipStats() {
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

  const vencidas = await prisma.sociomembresia.count({
    where: {
      AND: [
        {
          Vencimiento: {
            lt: now,
          },
        },
        {
          estadoMembresia: {
            in: ['Pagada'],
          },
        },
        {
          fechaCreacion: {
            gte: oneYearAgo,
          },
        },
      ],
    },
  })

  const porVencer = await prisma.sociomembresia.count({
    where: {
      AND: [
        {
          Vencimiento: {
            gt: now,
          },
        },
        {
          Vencimiento: {
            lte: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          },
        },
        {
          estadoMembresia: {
            in: ['Pagada'],
          },
        },
        {
          fechaCreacion: {
            gte: oneYearAgo,
          },
        },
      ],
    },
  })

  return { vencidas, porVencer }
}

export async function getPlanStats() {
  const now = new Date()

  const vencidos = await prisma.socio.count({
    where: {
      AND: [
        {
          idPlan: {
            not: null,
          },
        },
        {
          plan: {
            some: {
              AND: [
                {
                  fechaCreacion: {
                    not: null,
                  },
                },
                {
                  semanas: {
                    not: null,
                  },
                },
                {
                  OR: [
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 días en milisegundos
                          },
                        },
                        {
                          semanas: 1,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            lt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 días en milisegundos
                          },
                        },
                        {
                          semanas: 2,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            lt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 días en milisegundos
                          },
                        },
                        {
                          semanas: 3,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            lt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), // 28 días en milisegundos
                          },
                        },
                        {
                          semanas: 4,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  })

  const porVencer = await prisma.socio.count({
    where: {
      AND: [
        {
          idPlan: {
            not: null,
          },
        },
        {
          plan: {
            some: {
              AND: [
                {
                  fechaCreacion: {
                    not: null,
                  },
                },
                {
                  semanas: {
                    not: null,
                  },
                },
                {
                  OR: [
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 días en milisegundos
                          },
                        },
                        {
                          semanas: 1,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 días en milisegundos
                          },
                        },
                        {
                          semanas: 2,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            gte: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 días en milisegundos
                          },
                        },
                        {
                          semanas: 3,
                        },
                      ],
                    },
                    {
                      AND: [
                        {
                          fechaCreacion: {
                            gte: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), // 28 días en milisegundos
                          },
                        },
                        {
                          semanas: 4,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  })

  return { vencidos, porVencer }
}

export async function getPaymentStats(period: 'day' | 'month' | 'year' = 'month') {
  const now = new Date()
  let startDate: Date
  let endDate: Date

  switch (period) {
    case 'day':
      startDate = startOfDay(now)
      endDate = endOfDay(now)
      break
    case 'month':
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
      break
    case 'year':
      startDate = startOfYear(now)
      endDate = endOfYear(now)
      break
  }

  const payments = await prisma.sociomembresia_pago.findMany({
    where: {
      fecha: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      fecha: 'asc',
    },
  })

  const labels = payments
    .map(
      (payment) =>
        payment.fecha?.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: period === 'year' ? 'numeric' : undefined,
        })
    )
    .filter((label): label is string => label !== undefined)

  const data = payments.map((payment) => Number(payment.importe) || 0)

  return { labels, data }
}
