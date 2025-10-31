import { verify } from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import prisma from '@/app/config/db/prisma'

type TokenType = JwtPayload & {
  id: string
}

export async function GET(_: Request) {
  const secret = process.env.JWT_SECRET || ''
  const tokenName = process.env.TOKEN || ''
  const cookieStore = cookies()
  const token = cookieStore.get(tokenName)
  if (token) {
    const tokenDecode = verify(token?.value, secret) as TokenType | string
    let user
    if (typeof tokenDecode !== 'string') {
      user = await prisma.socio.findFirst({ where: { idSocio: parseInt(tokenDecode.id) } })
    }

    return NextResponse.json(
      { message: 'Datos de usuario', success: true, me: user },
      { status: 200 }
    )
  } else {
    return NextResponse.json({ message: 'No hay token', success: false }, { status: 500 })
  }
}
