import { useMutation } from '@tanstack/react-query'

import {
  createPilate,
  deletePilate,
  createFullPilate,
  addFAPState,
  createPilateAndSaveRecovered,
  deletePilateAll,
} from '@/app/actions/pilate'
import { pilateSchmaType, pilateFullSchmaType } from '@/app/schemas/pilate'

export function useCreatePilate() {
  return useMutation({
    mutationFn: ({ data }: { data: pilateSchmaType }) => createPilate(data),
  })
}

export function useCreatePilateAndSaveRecovered() {
  return useMutation({
    mutationFn: ({ data, idPilates }: { data: pilateSchmaType; idPilates: number }) =>
      createPilateAndSaveRecovered(data, idPilates),
  })
}

export function useCreateAllPilate() {
  return useMutation({
    mutationFn: ({ data }: { data: pilateFullSchmaType }) => createFullPilate(data),
  })
}

// export function useUpdatePilate() {
//   return useMutation({
//     mutationFn: ({ data, id }: { data: updatePilateType; id: number }) => updatePilate(id, data),
//   })
// }

export function useDeletePilate() {
  return useMutation({
    mutationFn: (id: number) => deletePilate(id),
  })
}

export function useDeletePilateAll() {
  return useMutation({
    mutationFn: (id: number) => deletePilateAll(id),
  })
}

export function useAddFAPState() {
  return useMutation({
    mutationFn: ({ id, fap }: { id: number; fap: 'F' | 'A' | 'P' }) => addFAPState(id, fap),
  })
}
