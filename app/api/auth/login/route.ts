import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import prisma from '@/app/config/db/prisma'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const SECRET = process.env.JWT_SECRET || ''
    const TOKEN_NAME = process.env.TOKEN || ''
    const userFound = await prisma.usuario.findFirst({
      where: {
        Usuario: username,
        idEstado: 3,
      },
    })

    if (!userFound)
      return NextResponse.json(
        { message: 'Usuario y/o contraseña incorrecta', success: false },
        { status: 404 }
      )
    const Password = userFound.Password
    const passwordMatch = await bcrypt.compare(password, Password || '')
    if (!passwordMatch)
      return NextResponse.json(
        { message: 'Usuario y/o contraseña incorrecta', success: false },
        { status: 404 }
      )

    const token = sign(
      {
        id: userFound.idUsuario,
        role: 'admin',
      },
      SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      {
        message: 'Login exitoso',
        success: true,
        userFound,
      },
      { status: 200 }
    )

    response.cookies.set({
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      name: TOKEN_NAME,
      path: '/',
      sameSite: 'lax',
      // sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: false,
      // secure: process.env.NODE_ENV === 'production',
      value: token,
    })

    // NextResponse.redirect(new URL('/admin/boards', request.url))

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Fallo desconocido. Intente mas tarde', success: false },
      { status: 500 }
    )
  }
}
