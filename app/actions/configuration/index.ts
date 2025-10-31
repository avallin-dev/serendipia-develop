'use server'

import prisma from '@/app/config/db/prisma'
import openai from '@/app/config/openAi'
import { updateConfigType } from '@/app/schemas/configuration'

export async function getConfig() {
  const data = await prisma.configuracion.findFirst({
    where: { idConfiguracion: 1 },
    select: {
      fechaModificacion: true,
      formularyTitle: true,
      mensajeVencimiento: true,
      cantidadBaja: true,
      cantidadAlta: true,
      cantidadActual: true,
      instrucciones: true,
    },
  })

  return data
}

export async function getFormTitle() {
  const data = await prisma.configuracion.findFirst({
    where: { idConfiguracion: 1 },
    select: {
      formularyTitle: true,
    },
  })

  return data?.formularyTitle
}

export async function updateConfig(data: updateConfigType) {
  const isLow = data.cantidadActual! <= data.cantidadBaja!
  const isHigh = data.cantidadActual! >= data.cantidadAlta!
  const frecuency = isLow ? 'BAJA' : isHigh ? 'ALTA' : 'NORMAL'
  await prisma.configuracion.update({
    where: {
      idConfiguracion: 1,
    },
    data: {
      fechaModificacion: new Date(),
      formularyTitle: data.formularyTitle,
      mensajeVencimiento: data.mensajeVencimiento,
      cantidadBaja: data.cantidadBaja,
      cantidadAlta: data.cantidadAlta,
      cantidadActual: data.cantidadActual,
      instrucciones: data.instrucciones,
      Mensaje: frecuency,
    },
  })

  const assistantId = process.env.OPENAI_ASSISTANT_ID
  if (assistantId && data.instrucciones) {
    await openai.beta.assistants.update(assistantId, {
      instructions: data.instrucciones,
    })
  }
}
