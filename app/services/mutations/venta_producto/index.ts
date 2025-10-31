import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createVentaProducto,
  updateVentaProducto,
  deleteVentaProducto,
  registrarVentaProducto,
} from '@/app/actions/venta_producto'

export const useCreateVentaProductoMutation = () => {
  return useMutation({
    mutationFn: ({ data }: { data: FormData }) => createVentaProducto(data),
  })
}

export const useUpdateVentaProductoMutation = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: number }) => updateVentaProducto(id, data),
  })
}

export const useDeleteVentaProductoMutation = () => {
  return useMutation({
    mutationFn: (id: number) => deleteVentaProducto(id),
  })
}

export const useRegistrarVentaProductoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      productoId: number
      socioId?: number | null
      cantidad: number
      total: number
    }) => registrarVentaProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venta-productos'] })
    },
  })
}
