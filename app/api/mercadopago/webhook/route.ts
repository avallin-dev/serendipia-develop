import { NextResponse } from 'next/server'

import { updateMercadoPagoPaymentStatus } from '@/app/actions/pay-method'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Mercado Pago puede enviar diferentes tipos de notificaciones, pero nos interesa payment
    if (body.type === 'payment' || body.topic === 'payment') {
      const payment_id = body.data?.id || body['data.id'] || body.id || body.resource_id
      // Buscar el preference_id asociado en la base de datos
      if (payment_id) {
        // Buscar el registro de pago para obtener el preference_id
        // (esto es necesario porque Mercado Pago no lo envía en el webhook)
        // Se asume que el payment_id es único
        const accessToken = process.env.MP_ACCESS_TOKEN
        const res = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const data = await res.json()
        const preference_id = data.order?.id || data.order?.preference_id || data.preference_id
        if (preference_id) {
          await updateMercadoPagoPaymentStatus({ payment_id: payment_id.toString(), preference_id })
        }
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en webhook Mercado Pago:', error)
    return NextResponse.json({ ok: true }) // Siempre responder 200 para evitar reintentos
  }
}
