import {NextResponse} from 'next/server'
import MercadoPagoConfig, {Payment} from 'mercadopago'


const CLIENT_SECRET = process.env.CLIENT_SECRET || ''
const CLIENT_ID = process.env.CLIENT_ID || ''
const _NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

/** Solicitar nuevo TOKEN */
const _refreshTokenBody = {
    client_secret: CLIENT_SECRET,
    client_id: CLIENT_ID,
    grant_type: "client_credentials",
    code: "TG-XXXXXXXX-241983636", // optional
    code_verifier: "47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU", //optional
    redirect_uri: _NEXT_PUBLIC_BASE_URL,
    refresh_token: "TG-XXXXXXXX-241983636", // optional
    test_token: false
}

const refreshToken = await fetch('https://api.mercadopago.com/oauth/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*",
        // Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(_refreshTokenBody),
})
const _tokenData = await refreshToken.json()
const accessToken = _tokenData.access_token


const client = new MercadoPagoConfig({
    accessToken: accessToken,
})


export async function POST(req: Request) {
    const body = await req.json()
    const payment = new Payment(client)

    const result = await payment.create({
        body: {
            ...body,
            installments: 1,
            payer: {
                email: body.payer.email,
            },
        },
    })

    return NextResponse.json({ ...result, estado: result.status })
}