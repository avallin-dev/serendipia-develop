'use server'
import prisma from '@/app/config/db/prisma'

export async function getPreviews(id: number) {
  return await prisma.partner_addon.findMany({
    where: {
      partnerId: id,
    },
    orderBy: { createdAt: 'asc' },
  })
}
