'use server'

import prisma from '@/app/config/db/prisma'
import { exerciseSchmaType } from '@/app/schemas/exercise'

export async function getAllExercises() {
  const data = await prisma.ejercicios.findMany({
    orderBy: { idEjercicio: 'desc' },
    include: { categoria_ej: true },
  })

  return data
}

export async function getExercise(id: number) {
  const data = await prisma.ejercicios.findFirst({ where: { idEjercicio: id } })

  return data
}

export async function createExercise(data: exerciseSchmaType) {
  await prisma.ejercicios.create({
    data: {
      nombreEj: data.nombreEj,
      linkEj: data.linkEj,
      idCategoria: parseInt(data.idCategoria),
      Comentario: data.Comentario ?? null,
    },
  })
}

export async function deleteExercise(id: number) {
  await prisma.ejercicios.delete({
    where: {
      idEjercicio: id,
    },
  })
}

export async function updateExercise(id: number, data: exerciseSchmaType) {
  await prisma.ejercicios.update({
    where: {
      idEjercicio: id,
    },
    data: {
      nombreEj: data.nombreEj,
      linkEj: data.linkEj,
      idCategoria: parseInt(data.idCategoria),
      Comentario: data.Comentario ?? null,
    },
  })
}
