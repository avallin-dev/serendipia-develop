import { NextResponse } from 'next/server'
import Pusher from 'pusher'

import prisma from '@/app/config/db/prisma'

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
const PUSHER_SECRET = process.env.PUSHER_SECRET || ''
const PUSHER_APP_ID = process.env.PUSHER_APP_ID || ''
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ''

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const sample = await prisma.socio_muestra.findMany({
      where: {
        idSocio: parseInt(id),
      },
      orderBy: { fechaMuestra: 'desc' },
    })

    return NextResponse.json(
      {
        message: 'Muestras',
        success: true,
        data: sample,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Fallo desconocido. Intente mas tarde', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const pusher = new Pusher({
    appId: PUSHER_APP_ID,
    cluster: PUSHER_CLUSTER,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    useTLS: true,
  })
  const { dateSample, weight, height, porcentageFat, porcentageMass, observation } =
    await request.json()

  try {
    await prisma.socio_muestra.create({
      data: {
        idSocio: parseInt(id),
        fechaMuestra: dateSample,
        peso: weight,
        estatura: height,
        porcentajeGrasaCorporal: porcentageFat,
        porcentajeMasaMuscular: porcentageMass,
        observacion: observation,
        idEstado: 1,
        idUsuarioCreo: 1,
      },
    })
    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(id),
        title: 'Nueva muestra agregada',
        type: 'sample',
        refLink: '/samples',
      },
    })
    await pusher.trigger(`notify-${id}`, 'sample-event', notification)

    return NextResponse.json({ message: 'Creacion de muestra', success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'No hay token', success: false }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { dateSample, weight, height, porcentageFat, porcentageMass, observation } =
    await request.json()
  try {
    await prisma.socio_muestra.update({
      where: {
        id: parseInt(id),
      },
      data: {
        fechaMuestra: dateSample,
        peso: weight,
        estatura: height,
        porcentajeGrasaCorporal: porcentageFat,
        porcentajeMasaMuscular: porcentageMass,
        observacion: observation,
      },
    })
    return NextResponse.json({ message: 'Creacion de muestra', success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'No hay token', success: false }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await prisma.socio_muestra.delete({ where: { id: parseInt(id) } })
    return NextResponse.json(
      { message: 'Eliminacion de muestra exitosa', success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'No hay token', success: false }, { status: 500 })
  }
}
