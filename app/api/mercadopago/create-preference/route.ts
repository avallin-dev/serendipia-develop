import { NextResponse } from 'next/server'
import MercadoPagoConfig, { Preference } from 'mercadopago'


const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})


const _NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function POST(req: Request) {
    const body = await req.json()


    const preference = new Preference(client)


    const result = await preference.create({
        body: {
            items: [
                {
                    title: body.title,
                    quantity: 1,
                    unit_price: body.price,
                    id: ""
                },
            ],
            back_urls: {
                success: `${_NEXT_PUBLIC_BASE_URL}/readme`,
                failure: `${_NEXT_PUBLIC_BASE_URL}/readme`,
                pending: `${_NEXT_PUBLIC_BASE_URL}/readme`,
            },
            auto_return: 'rejected',
        },
    })


    return NextResponse.json({ id: result.id })
}