'use server'

import { v4 as uuidv4 } from 'uuid'

import prisma from '@/app/config/db/prisma'
import { getSignedURL } from '@/lib/s3'
const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || ''

export async function getAllReadme() {
  const data = await prisma.readme.findMany({})

  return data
}

export async function createReadme(data: FormData) {
  const formObject = Object.fromEntries([...data])
  const key = `readme_${uuidv4()}`
  const signedURLResult = await getSignedURL(key)
  if (signedURLResult.failure !== undefined) {
    console.error(signedURLResult.failure)
    return
  }
  const { url } = signedURLResult.success
  if (formObject.file) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': (data.get('file') as File).type,
      },
      body: formObject.file,
    })
  }
  await prisma.readme.create({
    data: {
      title: data.get('title') as string,
      comment: data.get('comment') as string,
      file: `${R2_DOMAIN}${key}`,
      videoURL: data.get('videoURL') as string,
    },
  })
}

export async function deleteReadme(id: number) {
  await prisma.readme.delete({
    where: {
      id,
    },
  })
}

export async function updateReadme(id: number, data: FormData) {
  const formObject = Object.fromEntries([...data])
  const key = `readme_${uuidv4()}`
  const signedURLResult = await getSignedURL(key)
  if (signedURLResult.failure !== undefined) {
    console.error(signedURLResult.failure)
    return
  }
  const { url } = signedURLResult.success
  if (formObject.file) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': (data.get('file') as File).type,
      },
      body: formObject.file,
    })
  }

  await prisma.readme.update({
    where: {
      id,
    },
    data: {
      title: data.get('title') as string,
      comment: data.get('comment') as string,
      ...(formObject.file && { file: `${R2_DOMAIN}${key}` }),
      videoURL: data.get('videoURL') as string,
    },
  })
}
