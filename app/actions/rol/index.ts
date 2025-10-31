'use server'

import prisma from '@/app/config/db/prisma'
import { roleSchmaType } from '@/app/schemas/role'

export type PartnerByIdType = {
  Nombre: string | null
  Paterno: string | null
  DNI: string | null
}

export async function getAllRoles() {
  const data = await prisma.rol.findMany({
    include: { rol_modulo: { select: { cmodulo: true } } },
  })

  return data
}

export async function getModules() {
  const data = await prisma.cmodulo.findMany({})

  return data
}

export async function createRole(data: roleSchmaType) {
  const role = await prisma.rol.create({
    data: {
      FechaCreacion: new Date(),
      nombre: data.nombre,
      idEstado: 1,
      idUsuarioCreo: 1,
    },
  })
  data.modules.forEach(async (moduleItem) => {
    await prisma.rol_modulo.create({
      data: {
        idRol: role.id,
        idModulo: parseInt(moduleItem),
      },
    })
  })
}

export async function deleteRole(id: number) {
  // Eliminar primero los registros de rol_modulo asociados
  await prisma.rol_modulo.deleteMany({
    where: {
      idRol: id,
    },
  })

  // Buscar usuarios asociados a este rol
  const usuariosAsociados = await prisma.usuario.findMany({
    where: {
      idRol: id,
    },
    select: { idUsuario: true },
  })

  if (usuariosAsociados.length > 0) {
    // Verificar que exista el rol por defecto (id=1)
    const rolDefault = await prisma.rol.findUnique({ where: { id: 1 } })
    if (!rolDefault) {
      throw new Error(
        'No se puede eliminar el rol porque existen usuarios asociados y no existe un rol por defecto (id=1) para reasignar.'
      )
    }
    // Reasignar todos los usuarios al rol por defecto (id=1)
    await prisma.usuario.updateMany({
      where: { idRol: id },
      data: { idRol: 1 },
    })
  }

  // Intentar eliminar el rol
  try {
    await prisma.rol.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    throw new Error('Error al eliminar el rol. Puede que existan dependencias adicionales.')
  }
}

export async function updateRole(id: number, data: roleSchmaType) {
  await prisma.rol.update({
    where: {
      id,
    },
    data: {
      nombre: data.nombre,
    },
  })
  const existingModules = await prisma.rol_modulo.findMany({
    where: {
      idRol: id,
    },
    select: {
      idModulo: true,
    },
  })

  const existingModuleIds = existingModules.map((module) => module.idModulo)

  data.modules.forEach(async (moduleItem) => {
    const moduleId = parseInt(moduleItem)
    if (!existingModuleIds.includes(moduleId)) {
      await prisma.rol_modulo.create({
        data: {
          idRol: id,
          idModulo: moduleId,
        },
      })
    }
  })
}
