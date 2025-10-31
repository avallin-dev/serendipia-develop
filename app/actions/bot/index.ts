/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/app/config/db/prisma'
import openai from '@/app/config/openAi'

export async function createThread(socioId: number) {
  let thread = await prisma.chatthread.findUnique({ where: { socioId } })
  if (thread) return thread
  const openaiThread = await openai.beta.threads.create()
  thread = await prisma.chatthread.create({
    data: {
      socioId,
      openaiThreadId: openaiThread.id,
      updatedAt: new Date().toISOString(),
    },
  })
  return thread
}

export async function getThreadBySocio(socioId: number) {
  return await prisma.chatthread.findUnique({
    where: { socioId },
    include: { chatmessage: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function addMessage(socioId: number, content: string) {
  let thread = await prisma.chatthread.findUnique({ where: { socioId } })
  if (!thread) thread = await createThread(socioId)
  if (!thread) throw new Error('No se pudo crear el thread')

  await prisma.chatmessage.create({
    data: {
      threadId: thread.id,
      content,
      role: 'user',
    },
  })

  await openai.beta.threads.messages.create(thread.openaiThreadId, {
    role: 'user',
    content,
  })

  const run = await openai.beta.threads.runs.createAndPoll(thread.openaiThreadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID!,
  })

  if (run.status === 'completed') {
    const messagesList = await openai.beta.threads.messages.list(thread.openaiThreadId)
    const openaiResponse = messagesList.data.reverse().find((m) => m.role === 'assistant')
    let botResponse = 'Sin respuesta del bot'
    if (openaiResponse) {
      const textBlock = openaiResponse.content.find(
        (c) => c.type === 'text' && typeof (c as any).text?.value === 'string'
      )
      if (textBlock && typeof (textBlock as any).text?.value === 'string') {
        botResponse = (textBlock as any).text.value
      }
    }

    await prisma.chatmessage.create({
      data: {
        threadId: thread.id,
        content: botResponse,
        role: 'bot',
      },
    })

    return botResponse
  } else {
    throw new Error('Error al obtener respuesta del asistente')
  }
}

export async function getMessages(socioId: number) {
  const thread = await prisma.chatthread.findUnique({ where: { socioId } })
  if (!thread) return []
  return await prisma.chatmessage.findMany({
    where: { threadId: thread.id },
    orderBy: { createdAt: 'asc' },
  })
}

export async function resetThread(socioId: number) {
  const thread = await prisma.chatthread.findUnique({ where: { socioId } })
  if (!thread) throw new Error('No existe thread para este socio')
  await prisma.chatmessage.deleteMany({ where: { threadId: thread.id } })
  return { ok: true }
}

export async function getSociosWithChats() {
  const threads = await prisma.chatthread.findMany({
    where: {
      chatmessage: { some: {} },
    },
    include: {
      socio: true,
    },
  })
  return threads.map((t) => ({
    idSocio: t.socioId,
    nombre: t.socio?.Nombre,
    paterno: t.socio?.Paterno,
  }))
}
