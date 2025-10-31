import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import prisma from '@/app/config/db/prisma'

export async function POST(request: Request) {
  try {
    const { dni } = await request.json()
    const secret = process.env.JWT_SECRET || ''
    const tokenName = process.env.TOKEN || ''
    const userFound = await prisma.socio.findFirst({
      where: {
        DNI: dni.toString(),
      },
    })

    if (!userFound)
      return NextResponse.json(
        { message: 'DNI del Socio incorrecto', success: false },
        { status: 404 }
      )

    const token = sign(
      {
        id: userFound.idSocio,
        role: 'partner',
      },
      secret,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      {
        message: 'Login exitoso',
        success: true,
        token,
        userFound,
      },
      { status: 200 }
    )

    response.cookies.set({
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      name: tokenName,
      path: '/',
      // sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      value: token,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      secure: false,
    })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Fallo desconocido. Intente mas tarde', success: false },
      { status: 500 }
    )
  }
}
