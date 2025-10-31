import { NextResponse } from 'next/server'

import prisma from '@/app/config/db/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { name, last_name, email, phone } = await request.json()
    await prisma.socio.update({
      where: {
        idSocio: parseInt(id),
      },
      data: {
        correo: email,
        Nombre: name,
        Paterno: last_name,
        Telefono: phone,
      },
    })

    return NextResponse.json(
      {
        message: 'Actualizacion exitosa',
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Fallo desconocido. Intente mas tarde', success: false },
      { status: 500 }
    )
  }
}
