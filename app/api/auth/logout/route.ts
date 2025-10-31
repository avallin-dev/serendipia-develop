import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export function GET(_: Request) {
  const cookieStore = cookies()
  const tokenName = process.env.TOKEN || ''
  const token = cookieStore.get(tokenName)

  if (!token) {
    return NextResponse.json({ message: 'No tiene sesión' }, { status: 401 })
  }

  try {
    cookieStore.delete(tokenName)
    const response = NextResponse.json({ message: 'Logout exitoso' }, { status: 200 })

    return response
  } catch (error) {
    return NextResponse.json({ message: 'Error desconocido' }, { status: 500 })
  }
}
