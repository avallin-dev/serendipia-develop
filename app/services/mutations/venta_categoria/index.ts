import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createVentaCategoria,
  updateVentaCategoria,
  deleteVentaCategoria,
} from '@/app/actions/venta_producto'

export const useCreateVentaCategoriaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { nombre: string }) => createVentaCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venta-categories'] })
    },
  })
}

export const useUpdateVentaCategoriaMutation = () => {
  return useMutation({
    mutationFn: (data: { id: number; nombre: string }) => updateVentaCategoria(data.id, data),
  })
}

export const useDeleteVentaCategoriaMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteVentaCategoria(id),
  })
}
