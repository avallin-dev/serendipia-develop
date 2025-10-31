'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'

import { useGetVentaProductos, useGetVentas } from '@/app/services/queries/venta_producto'

import { Button } from '../ui/button'

export default function VentasTable() {
  const { productos, isLoading: loadingProductos } = useGetVentaProductos()
  const { ventas, isLoading: loadingVentas } = useGetVentas()

  // Calcular ventas y ganancia por producto
  const productosConVentas = productos.map((producto: any) => {
    const ventasDeProducto = ventas.filter((v: any) => v.productoId === producto.id)
    const cantidadVendida = ventasDeProducto.reduce((acc: number, v: any) => acc + v.cantidad, 0)
    const totalVentas = ventasDeProducto.reduce((acc: number, v: any) => acc + v.total, 0)
    // Suponiendo que el precio de compra es producto.precio
    // Si hay un campo de costo, reemplazar aquí
    const ganancia = totalVentas - cantidadVendida * producto.precio
    // Aviso de notificación: porcentaje de stock actual vs mínimo
    const aviso =
      producto.cantidadMin > 0 ? Math.round((producto.cantidad / producto.cantidadMin) * 100) : 100
    return {
      ...producto,
      cantidadVendida,
      totalVentas,
      ganancia,
      aviso,
    }
  })

  function handleExport() {
    const sheet = productosConVentas.map((p: any) => ({
      Producto: p.nombre,
      'Cantidad actual': p.cantidad,
      Ventas: p.cantidadVendida,
      'Compra (precio)': p.precio,
      Ganancia: p.ganancia,
      'Aviso notificación (%)': p.aviso,
    }))
    const ws = XLSX.utils.json_to_sheet(sheet)
    const colNames = Object.keys(sheet[0] || {})
    ws['!cols'] = colNames.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...sheet.map((row) => (row[col] ? String(row[col]).length : 0))
      )
      return { wch: maxLen + 2 }
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas productos')
    XLSX.writeFile(wb, 'ventas-productos.xlsx')
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Ventas de productos</h2>
        <Button
          className="flex items-center gap-1 rounded border px-2 py-1 text-base hover:opacity-75"
          onClick={handleExport}
          title="Exportar a Excel"
          variant="secondary"
        >
          <FiDownload />
        </Button>
      </div>
      <div className="overflow-x-auto rounded border bg-white p-2">
        <table className="min-w-full text-base">
          <thead>
            <tr>
              <th className="px-2 py-1">Producto</th>
              <th className="px-2 py-1">Cantidad actual</th>
              <th className="px-2 py-1">Ventas</th>
              <th className="px-2 py-1">Compra (precio)</th>
              <th className="px-2 py-1">Ganancia</th>
              <th className="px-2 py-1">Aviso notificación (%)</th>
            </tr>
          </thead>
          <tbody>
            {loadingProductos || loadingVentas ? (
              <tr>
                <td colSpan={6}>Cargando...</td>
              </tr>
            ) : productosConVentas.length === 0 ? (
              <tr>
                <td colSpan={6}>Sin productos</td>
              </tr>
            ) : (
              productosConVentas.map((p: any) => (
                <tr key={p.id}>
                  <td className="px-2 py-1 text-center">{p.nombre}</td>
                  <td className="px-2 py-1 text-center">{p.cantidad}</td>
                  <td className="px-2 py-1 text-center">{p.cantidadVendida}</td>
                  <td className="px-2 py-1 text-center">${p.precio}</td>
                  <td className="px-2 py-1 text-center">${p.ganancia}</td>
                  <td className="px-2 py-1 text-center">{p.aviso}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
