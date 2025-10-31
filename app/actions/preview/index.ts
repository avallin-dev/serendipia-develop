/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use server'

import prisma from '@/app/config/db/prisma'
import type { Sample_Muestra } from '@/app/types/sample'

export async function getPartnerSamples(id: number): Promise<Sample_Muestra[]> {
  const data = await prisma.socio_muestra.findMany({
    where: {
      idSocio: id,
    },
    orderBy: { fechaMuestra: 'desc' },
  })

  data.forEach((item) => {
    item.peso = item.peso?.toNumber()
    item.estatura = item.estatura?.toNumber()
    item.porcentajeGrasaCorporal = item.porcentajeGrasaCorporal?.toNumber()
    item.porcentajeMasaMuscular = item.porcentajeMasaMuscular?.toNumber()
  })

  return data
}
