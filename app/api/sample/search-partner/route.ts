import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import prisma from '@/app/config/db/prisma'

export async function POST(request: Request) {
  const { search }: { search: string } = await request.json()
  const [firstName, lastName]: [string, string | undefined] = search.split(' ') as [
    string,
    string | undefined,
  ]
  const hasNumber = /\d/.test(search)
  let where: Prisma.socioWhereInput = {
    idEstado: 1,
  }

  if (hasNumber) {
    where.DNI = {
      contains: search,
    }
  } else if (lastName) {
    where = {
      idEstado: 1,
      AND: [
        {
          Nombre: {
            contains: firstName,
          },
        },
        {
          Paterno: {
            contains: lastName,
          },
        },
      ],
    }
  } else {
    where.Nombre = {
      contains: firstName,
    }
  }
  try {
    const partner = await prisma.socio.findMany({
      where,
      take: 5,
    })
    return NextResponse.json(
      { message: 'Datos de usuario', success: true, data: partner },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'No hay token', success: false }, { status: 500 })
  }
}
