import { $Enums } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import {
  createRoutine,
  deleteRoutine,
  updateRoutine,
  updateRoutineFeedback,
} from '@/app/actions/routine'
import { routineSchmaType } from '@/app/schemas/routine'

export function useCreateRoutine() {
  return useMutation({
    mutationFn: ({ data }: { data: routineSchmaType }) => createRoutine(data),
  })
}

export function useUpdateRoutine() {
  return useMutation({
    mutationFn: ({ data, id }: { data: routineSchmaType; id: number }) => updateRoutine(id, data),
  })
}

export function useDeleteRoutine() {
  return useMutation({
    mutationFn: (id: number) => deleteRoutine(id),
  })
}

export function useUpdateRoutineFeedback() {
  return useMutation({
    mutationFn: ({
      routineDetalleId,
      rpe,
      comentario,
    }: {
      routineDetalleId: number
      rpe: $Enums.borg
      comentario: string
    }) => updateRoutineFeedback(routineDetalleId, rpe, comentario),
  })
}
