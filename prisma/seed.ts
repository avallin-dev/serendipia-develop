import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.usuario.create({
    data: {
      Usuario: 'superadmin',
      Nombre: 'superadmin',
      Password: await bcrypt.hash('S@porte2024@2024@', 12),
      idRol: 1,
      idEstado: 3,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
