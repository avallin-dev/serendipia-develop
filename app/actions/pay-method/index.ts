'use server'

import prisma from '@/app/config/db/prisma'
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
export async function createMercadoPagoPreference({
  idSocio,
  idSocioMembresia,
  nombreMembresia,
  monto,
  socioEmail,
}: {
  idSocio: number
  idSocioMembresia: number
  nombreMembresia: string
  monto: number
  socioNombre: string
  socioEmail: string
}) {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error('Falta la variable de entorno MP_ACCESS_TOKEN')

  // Crear suscripción mensual (preapproval) en Mercado Pago
  const body = {
    reason: nombreMembresia,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: monto,
      currency_id: 'ARS',
    },
    payer_email: socioEmail,
    back_url: `${NEXT_PUBLIC_BASE_URL}/profile`,
    status: 'pending',
    external_reference: `${idSocio}-${idSocioMembresia}`,
    metadata: {
      idSocio,
      idSocioMembresia,
    },
  }

  const res = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!data.id || !data.init_point) throw new Error('No se pudo crear la suscripción de pago')

  // Registrar la suscripción como pendiente
  await prisma.mercadopago_pago.create({
    data: {
      idSocio,
      idSocioMembresia,
      monto,
      estado: 'pendiente',
      mp_preference_id: data.id,
      raw_response: JSON.stringify(data),
    },
  })

  return { url: data.init_point }
}

export async function updateMercadoPagoPaymentStatus({
  payment_id,
  preference_id,
}: {
  payment_id: string
  preference_id: string
}) {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error('Falta la variable de entorno MP_ACCESS_TOKEN')

  // Consultar el estado real del pago en Mercado Pago
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await res.json()
  if (!data.id) throw new Error('No se encontró el pago en Mercado Pago')

  // Actualizar el registro en mercadopago_pago
  const pago = await prisma.mercadopago_pago.findFirst({
    where: { mp_preference_id: preference_id },
  })
  if (!pago) return { ok: false, notFound: true }

  // Si ya está pagado, no hacer nada más
  if (pago.estado === 'Pagada') {
    return { ok: true, alreadyPaid: true }
  }

  await prisma.mercadopago_pago.update({
    where: { id: pago.id },
    data: {
      estado: data.status,
      mp_payment_id: data.id.toString(),
      raw_response: JSON.stringify(data),
    },
  })

  // Si el pago fue aprobado, renovar la membresía y registrar el pago
  if (data.status === 'approved') {
    // Obtener la membresía actual
    const membresia = await prisma.sociomembresia.findUnique({
      where: { idSocioMembresia: pago.idSocioMembresia },
    })

    // Calcular nueva fecha de vencimiento
    let nuevaVencimiento = new Date()
    if (membresia?.Vencimiento && new Date(membresia.Vencimiento) > nuevaVencimiento) {
      nuevaVencimiento = new Date(membresia.Vencimiento)
    }
    nuevaVencimiento.setMonth(nuevaVencimiento.getMonth() + 1) // Sumar un mes

    await prisma.sociomembresia.update({
      where: { idSocioMembresia: pago.idSocioMembresia },
      data: {
        estadoMembresia: 'Pagada',
        Vencimiento: nuevaVencimiento,
      },
    })

    // Registrar el pago en sociomembresia_pago
    await prisma.sociomembresia_pago.create({
      data: {
        idSocioMembresia: pago.idSocioMembresia,
        fecha: new Date(),
        importe: pago.monto,
        observacion: 'Pago automático vía Mercado Pago',
        idEstado: 1, // Asumiendo 1 = pagado
      },
    })
  }
  return { ok: true }
}

export async function validateMercadoPagoSubscription({
  preapproval_id,
}: {
  preapproval_id: string
  status?: string
}) {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error('Falta la variable de entorno MP_ACCESS_TOKEN')

  // Consultar el estado real de la suscripción en Mercado Pago
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapproval_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await res.json()
  if (!data.id) throw new Error('No se encontró la suscripción en Mercado Pago')

  // Considerar activa si status es authorized o paused (según tu lógica)
  const active = data.status === 'authorized' || data.status === 'paused'

  return {
    active,
    status: data.status,
    raw: data,
  }
}
