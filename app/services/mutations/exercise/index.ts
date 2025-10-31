import { useMutation } from '@tanstack/react-query'

import { createExercise, deleteExercise, updateExercise } from '@/app/actions/exercise'
import { exerciseSchmaType } from '@/app/schemas/exercise'

export function useCreateExercise() {
  return useMutation({
    mutationFn: ({ data }: { data: exerciseSchmaType }) => createExercise(data),
  })
}

export function useUpdateExercise() {
  return useMutation({
    mutationFn: ({ data, id }: { data: exerciseSchmaType; id: number }) => updateExercise(id, data),
  })
}

export function useDeleteExercise() {
  return useMutation({
    mutationFn: (id: number) => deleteExercise(id),
  })
}
