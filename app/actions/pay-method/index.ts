'use server'

import prisma from '@/app/config/db/prisma'

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const CLIENT_ID = process.env.CLIENT_ID || ''
const CLIENT_SECRET = process.env.CLIENT_SECRET || ''

export async function createMercadoPagoPreference({
                                                      idSocio,
                                                      idSocioMembresia,
                                                      nombreMembresia,
                                                      monto,
                                                      socioNombre,
                                                      socioEmail,
                                                  }: {
    idSocio: number
    idSocioMembresia: number
    nombreMembresia: string
    monto: number
    socioNombre: string
    socioEmail: string
}) {
    let accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) throw new Error('Falta la variable de entorno MP_ACCESS_TOKEN')

    // Crear suscripción mensual (preapproval) en Mercado Pago
    // const body = {
    //   reason: nombreMembresia,
    //   auto_recurring: {
    //     frequency: 1,
    //     frequency_type: 'months',
    //     transaction_amount: monto,
    //     currency_id: 'ARS',
    //   },
    //   payer_email: socioEmail,
    //   back_url: `${NEXT_PUBLIC_BASE_URL}/profile`,
    //   status: 'pending',
    //   external_reference: `${idSocio}-${idSocioMembresia}`,
    //   metadata: {
    //     idSocio,
    //     idSocioMembresia,
    //   },
    // }

    /*solicitar el token refrescado*/
    const _refreshTokenBody = {
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        grant_type: "client_credentials",
        code: "TG-XXXXXXXX-241983636", // optional
        code_verifier: "47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU", //optional
        redirect_uri: NEXT_PUBLIC_BASE_URL,
        refresh_token: "TG-XXXXXXXX-241983636", // optional
        test_token: false
    }

    const refreshToken = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(_refreshTokenBody),
    })

    const _tokenData = await refreshToken.json()
    accessToken = _tokenData.access_token

    // Crear preferencia en Mercado Pago
    const body = {
        items: [
            {
                id: `Pago Membresia ${idSocioMembresia}`,
                title: nombreMembresia,
                quantity: 1,
                unit_price: Number(monto),
                currency_id: 'ARS',
            },
        ],
        payer: {
            name: socioNombre,
            email: socioEmail,
        },
        back_urls: {
            success: `${NEXT_PUBLIC_BASE_URL}/profile`,
            failure: `${NEXT_PUBLIC_BASE_URL}/profile`,
            pending: `${NEXT_PUBLIC_BASE_URL}/profile`,
        },
        auto_return: 'approved',
        metadata: {
            idSocio,
            idSocioMembresia,
        },
    }

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
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

    return {url: data.init_point}
}

export async function updateMercadoPagoPaymentStatus({
  payment_id,
  preference_id,
}: {
  payment_id: string
  preference_id: string
}) {
    let accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) throw new Error('Falta la variable de entorno MP_ACCESS_TOKEN')

    /*solicitar el token refrescado*/
    const _refreshTokenBody = {
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        grant_type: "client_credentials",
        code: "TG-XXXXXXXX-241983636", // optional
        code_verifier: "47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU", //optional
        redirect_uri: NEXT_PUBLIC_BASE_URL,
        refresh_token: "TG-XXXXXXXX-241983636", // optional
        test_token: false
    }

    const refreshToken = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(_refreshTokenBody),
    })

    const _tokenData = await refreshToken.json()
    accessToken = _tokenData.access_token

    console.log('Actualizando estado de la membresia renovación');
    // Consultar el estado real del pago en Mercado Pago
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const data = await res.json()
    console.log('Respuesta de peticion de pago *******************')
    console.log(data)
    console.log(JSON.stringify(data))


    if (!data.id) throw new Error('No se encontró el pago en Mercado Pago')

    // Actualizar el registro en mercadopago_pago
    const pago = await prisma.mercadopago_pago.findFirst({
        where: {mp_preference_id: preference_id},
    })
    if (!pago) return {ok: false, notFound: true}

    // Si ya está pagado, no hacer nada más
    if (pago.estado === 'Pagada') {
        return {ok: true, alreadyPaid: true}
    }

    await prisma.mercadopago_pago.update({
        where: {id: pago.id},
        data: {
            estado: data.status,
            mp_payment_id: data.id.toString(),
            raw_response: JSON.stringify(data),
        },
    })

    // Si el pago fue aprobado, renovar la membresía y registrar el pago
    // Validaciones para ver si actualiza la renovacion no puedo probar para ver la respuesta de la transaccion
    if (data.status === 'approved' || data.status === 'OK' || data.code === '200' || data.code === '201') {
        // Obtener la membresía actual
        const membresia = await prisma.sociomembresia.findUnique({
            where: {idSocioMembresia: pago.idSocioMembresia},
        })

        // Calcular nueva fecha de vencimiento
        let nuevaVencimiento = new Date()
        if (membresia?.Vencimiento && new Date(membresia.Vencimiento) > nuevaVencimiento) {
            nuevaVencimiento = new Date(membresia.Vencimiento)
        }
        nuevaVencimiento.setMonth(nuevaVencimiento.getMonth() + 1) // Sumar un mes

        await prisma.sociomembresia.update({
            where: {idSocioMembresia: pago.idSocioMembresia},
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
    return {ok: true}
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
