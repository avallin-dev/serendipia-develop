import { useMutation } from '@tanstack/react-query'

import { sampleType } from '@/app/schemas/sample/sample'
import api from '@/lib/api-client'

export function useCreateSample() {
  return useMutation({
    mutationFn: ({ data, id }: { data: sampleType; id: number }) => api.post(`/sample/${id}`, data),
  })
}

export function useUpdateSample() {
  return useMutation({
    mutationFn: ({ data, id }: { data: sampleType; id: number }) => api.put(`/sample/${id}`, data),
  })
}

export function useDeleteSample() {
  return useMutation({
    mutationFn: (id: number) => api.delete(`/sample/${id}`),
  })
}
