'use server'

import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET || ''

type TokenType = {
  id: string
  role: string
}

export async function getUserIdFromToken(): Promise<number | null> {
  const token = cookies().get('token')

  if (!token) return null

  try {
    const decoded = verify(token.value, SECRET) as TokenType
    return parseInt(decoded.id)
  } catch (error) {
    console.error('Error al decodificar token:', error)
    return null
  }
}
