'use client'

import { Decimal } from '@prisma/client/runtime/library'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import DataTablePagination from '@/app/components/data-table-pagination'
import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { useGetVentas } from '@/app/services/queries/venta_producto'

// Tipos
type VentaRow = {
  id: number
  socio: { Nombre: string; Paterno: string } | null
  fecha: string | Date
  producto: { nombre: string }
  cantidad: number
  total: number | Decimal
}
type VentaApi = Omit<VentaRow, 'socio'> & {
  socio: { Nombre: string | null; Paterno: string | null } | null
}

export default function VentasHistorialPage() {
  const { ventas, isLoading } = useGetVentas()
  const [data, setData] = useState<VentaRow[]>([])

  useEffect(() => {
    if (!isLoading && ventas) {
      const ventasApi = ventas as unknown as VentaApi[]
      setData(
        ventasApi.map((v) => ({
          ...v,
          socio: v.socio
            ? {
                Nombre: v.socio.Nombre ?? '',
                Paterno: v.socio.Paterno ?? '',
              }
            : null,
          total:
            typeof v.total === 'object' && v.total !== null && 'toNumber' in v.total
              ? v.total
              : Number(v.total),
        }))
      )
    }
  }, [isLoading, ventas])

  const columns = useMemo<ColumnDef<VentaRow, unknown>[]>(
    () => [
      {
        id: 'socio',
        header: 'Socio',
        accessorFn: (row) => (row.socio ? `${row.socio.Nombre} ${row.socio.Paterno}` : 'Sin socio'),
        cell: (info) => info.getValue(),
      },
      {
        id: 'fecha',
        header: 'Fecha',
        accessorKey: 'fecha',
        cell: (info) => {
          const value = info.getValue()
          if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
            const date = new Date(value)
            return format(date, 'dd/MM/yyyy HH:mm')
          }
          return '-'
        },
      },
      {
        id: 'producto',
        header: 'Producto',
        accessorFn: (row) => row.producto?.nombre || '',
        cell: (info) => info.getValue(),
      },
      {
        id: 'cantidad',
        header: 'Cantidad',
        accessorKey: 'cantidad',
        cell: (info) => info.getValue(),
      },
      {
        id: 'total',
        header: 'Total',
        accessorKey: 'total',
        cell: (info) => `$${info.getValue()}`,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <TablesLoading />

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">Historial de Ventas</h1>
        <Link href="/admin/venta_producto">
          <Button variant="outline">Regresar a productos</Button>
        </Link>
      </div>
      <div className="w-full overflow-x-auto rounded-md shadow-md">
        <table className="min-w-full border text-sm">
          <thead className="bg-alto-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-center font-bold text-chicago-600 first:rounded-tl-lg first:pl-5 last:rounded-tr-lg"
                  >
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() && 'selected'} className="h-12">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="first:pl-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center text-chicago-600">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
