import { useQuery } from '@tanstack/react-query'

import { getVentaProductos, getVentas } from '@/app/actions/venta_producto'

export const useGetVentaProductos = () => {
  const {
    data: productos = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['venta-productos'],
    queryFn: async () => {
      const data = await getVentaProductos()
      return data
    },
  })
  return { productos, isLoading, isFetching }
}

export const useGetVentas = () => {
  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: async () => {
      const data = await getVentas()
      return data
    },
  })
  return { ventas, isLoading }
}
