import { useMutation } from '@tanstack/react-query'

import { createReadme, deleteReadme, updateReadme } from '@/app/actions/readme'

export function useCreateReadme() {
  return useMutation({
    mutationFn: ({ data }: { data: FormData }) => createReadme(data),
  })
}

export function useUpdateReadme() {
  return useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: number }) => updateReadme(id, data),
  })
}

export function useDeleteReadme() {
  return useMutation({
    mutationFn: (id: number) => deleteReadme(id),
  })
}
