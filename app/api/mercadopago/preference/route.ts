import { NextResponse } from 'next/server'

import { createMercadoPagoPreference } from '@/app/actions/pay-method'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { idSocio, idSocioMembresia, nombreMembresia, monto, socioNombre, socioEmail } = body
    const res = await createMercadoPagoPreference({
      idSocio,
      idSocioMembresia,
      nombreMembresia,
      monto,
      socioNombre,
      socioEmail,
    })
    return NextResponse.json(res)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 })
  }
}
