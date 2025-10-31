import type { rutina_ejercicio } from '@prisma/client'

export default function seleccionar_semana(semana: number, rutina: rutina_ejercicio) {
  let repeticion
  let comentario
  switch (semana) {
    case 1:
      repeticion = rutina.repeticionS1
      comentario = rutina.comentarioS1
      break
    case 2:
      repeticion = rutina.repeticionS2
      comentario = rutina.comentarioS2
      break
    case 3:
      repeticion = rutina.repeticionS3
      comentario = rutina.comentarioS3
      break
    case 4:
      repeticion = rutina.repeticionS4
      comentario = rutina.comentarioS4
      break
    case 5:
      repeticion = rutina.repeticionS5
      comentario = rutina.comentarioS5
      break
    case 6:
      repeticion = rutina.repeticionS6
      comentario = rutina.comentarioS6
      break
    case 7:
      repeticion = rutina.repeticionS7
      comentario = rutina.comentarioS7
      break
    case 8:
      repeticion = rutina.repeticionS8
      comentario = rutina.comentarioS8
      break
    case 9:
      repeticion = rutina.repeticionS9
      comentario = rutina.comentarioS9
      break
    case 10:
      repeticion = rutina.repeticionS10
      comentario = rutina.comentarioS10
      break
    case 11:
      repeticion = rutina.repeticionS11
      comentario = rutina.comentarioS11
      break
    case 12:
      repeticion = rutina.repeticionS12
      comentario = rutina.comentarioS12
      break
  }
  return [repeticion, comentario]
}
