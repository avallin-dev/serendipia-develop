'use server'

import { v4 as uuidv4 } from 'uuid'

import prisma from '@/app/config/db/prisma'
import { getSignedURL } from '@/lib/s3'
const R2_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || ''

export async function getVentaProductos() {
  return await prisma.venta_producto
    .findMany({
      include: { categoria: true },
      orderBy: { id: 'desc' },
    })
    .then((data) =>
      data.map((producto) => ({
        ...producto,
        precio: producto.precio ? Number(producto.precio) : null,
      }))
    )
}

export async function createVentaProducto(data: FormData) {
  const formObject = Object.fromEntries([...data])
  const key = `venta_producto_${uuidv4()}`
  const signedURLResult = await getSignedURL(key)
  if (signedURLResult.failure !== undefined) {
    console.error(signedURLResult.failure)
    return
  }
  const { url } = signedURLResult.success
  if (formObject.imagen) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': (data.get('imagen') as File).type,
      },
      body: formObject.imagen,
    })
  }
  return await prisma.venta_producto.create({
    data: {
      nombre: formObject.nombre as string,
      sku: formObject.sku as string,
      descripcion: formObject.descripcion as string,
      precio: Number(formObject.precio),
      cantidad: Number(formObject.cantidad),
      cantidadMin: Number(formObject.cantidadMin),
      // imagen: `${R2_DOMAIN}${key}`,
      imagen: formObject.imagen as string,
      categoriaId: Number(formObject.categoriaId),
    },
  })
}

export async function getVentaCategories() {
  return await prisma.venta_categoria.findMany({
    orderBy: { nombre: 'asc' },
  })
}

export async function createVentaCategoria(data: { nombre: string }) {
  return await prisma.venta_categoria.create({ data })
}

export async function updateVentaCategoria(id: number, data: { nombre: string }) {
  return await prisma.venta_categoria.update({ where: { id }, data })
}

export async function deleteVentaCategoria(id: number) {
  return await prisma.venta_categoria.delete({ where: { id } })
}

export async function updateVentaProducto(id: number, data: FormData) {
  const formObject = Object.fromEntries([...data])
  const key = `venta_producto_${uuidv4()}`
  const signedURLResult = await getSignedURL(key)
  if (signedURLResult.failure !== undefined) {
    console.error(signedURLResult.failure)
    return
  }
  const { url } = signedURLResult.success
  if (formObject.imagen) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': (data.get('imagen') as File).type,
      },
      body: formObject.imagen,
    })
  }
  return await prisma.venta_producto.update({
    where: { id },
    data: {
      nombre: formObject.nombre as string,
      sku: formObject.sku as string,
      descripcion: formObject.descripcion as string,
      precio: Number(formObject.precio),
      cantidad: Number(formObject.cantidad),
      cantidadMin: Number(formObject.cantidadMin),
      // imagen: `${R2_DOMAIN}${key}`,
      imagen: formObject.imagen as string,
      categoriaId: Number(formObject.categoriaId),
    },
  })
}

export async function deleteVentaProducto(id: number) {
  return await prisma.venta_producto.delete({
    where: { id },
  })
}

export async function registrarVentaProducto({
  productoId,
  socioId,
  cantidad,
  total,
}: {
  productoId: number
  socioId?: number | null
  cantidad: number
  total: number
}) {
  const venta = await prisma.venta.create({
    data: {
      productoId,
      socioId,
      cantidad,
      total,
      fecha: new Date(),
    },
  })
  // Actualizar el stock del producto
  const productoActualizado = await prisma.venta_producto.update({
    where: { id: productoId },
    data: {
      cantidad: {
        decrement: cantidad,
      },
    },
  })
  return { venta, productoActualizado }
}

export async function getVentas() {
  return await prisma.venta
    .findMany({
      include: {
        producto: true,
        socio: true,
      },
      orderBy: { fecha: 'desc' },
    })
    .then((data) =>
      data.map((venta) => ({
        ...venta,
        producto: {
          ...venta.producto,
          precio: venta.producto.precio ? Number(venta.producto.precio) : null,
        },
        total: venta.total ? Number(venta.total) : null,
      }))
    )
}
