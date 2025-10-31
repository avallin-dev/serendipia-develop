'use server'

import bcrypt from 'bcrypt'

import prisma from '@/app/config/db/prisma'
import { usuarioSchmaType, updateUserType } from '@/app/schemas/admin-user'
import { getUserIdFromToken } from '@/app/utils/auth'

export async function getAllUsers() {
  const data = await prisma.usuario.findMany({
    where: {
      idEstado: 3,
      Nombre: { not: 'superadmin' },
    },
    orderBy: { idUsuario: 'desc' },
    include: { rol: true },
  })

  return data
}

export async function getAllUsersEvenSuperAdmin() {
  const data = await prisma.usuario.findMany({
    where: {
      idEstado: 3,
    },
    orderBy: { idUsuario: 'desc' },
  })

  return data
}

export async function getUserModules() {
  const idUsuario = await getUserIdFromToken()
  const data = await prisma.usuario.findFirst({
    where: { idUsuario: idUsuario! },
    include: { rol: { include: { rol_modulo: { include: { cmodulo: true } } } } },
  })

  return data
}

export async function createUser(data: usuarioSchmaType) {
  await prisma.usuario.create({
    data: {
      idEstado: 3,
      Usuario: data.Usuario,
      Password: await bcrypt.hash(data.Password, 12),
      Nombre: data.Usuario,
      idRol: parseInt(data.rol),
      fechaCreacion: new Date(),
      Telefono: data.Telefono,
    },
  })
}

export async function deleteUser(id: number) {
  // 1. Eliminar en cascada: clase, entrada, salida
  await prisma.clase.deleteMany({ where: { idUsuarioCreo: id } })
  await prisma.entrada.deleteMany({ where: { idUsuarioCreo: id } })
  await prisma.salida.deleteMany({ where: { idUsuarioCreo: id } })

  // 2. Si es creador de algún rol, reasignar esos roles al usuario con id 1
  const usuarioDefault = await prisma.usuario.findUnique({ where: { idUsuario: 1 } })
  if (!usuarioDefault) {
    throw new Error(
      'No se puede eliminar el usuario porque existen roles creados por él y no existe un usuario por defecto (id=1) para reasignar.'
    )
  }
  await prisma.rol.updateMany({
    where: { idUsuarioCreo: id },
    data: { idUsuarioCreo: 1 },
  })

  // 3. Eliminar el usuario
  await prisma.usuario.delete({
    where: {
      idUsuario: id,
    },
  })
}

export async function updateUser(id: number, data: updateUserType) {
  let password = ''
  if (data.Password) {
    password = await bcrypt.hash(data.Password, 12)
  }
  await prisma.usuario.update({
    where: {
      idUsuario: id,
    },
    data: {
      Usuario: data.Usuario,
      Nombre: data.Usuario,
      ...(password && { Password: password }),
      idRol: parseInt(data.rol!),
      Telefono: data.Telefono,
    },
  })
}
