'use server'

import prisma from '@/app/config/db/prisma'
import { categorySchmaType, updateCategoryType } from '@/app/schemas/category'

export async function getAllCategories() {
  const data = await prisma.categoria_ej.findMany({
    orderBy: { idCategoria: 'desc' },
  })

  return data
}

export async function createCategory(data: categorySchmaType) {
  await prisma.categoria_ej.create({
    data: {
      nombreCat: data.nombreCat,
    },
  })
}

export async function deleteCategory(id: number) {
  await prisma.categoria_ej.delete({
    where: {
      idCategoria: id,
    },
  })
}

export async function updateCategory(id: number, data: updateCategoryType) {
  await prisma.categoria_ej.update({
    where: {
      idCategoria: id,
    },
    data: {
      nombreCat: data.nombreCat,
    },
  })
}
