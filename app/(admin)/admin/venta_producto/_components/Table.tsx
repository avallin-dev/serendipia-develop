/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
// import Image from 'next/image'
import { Image } from '@imagekit/next';
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LuPencil, LuX } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'

import DataTablePagination from '@/app/components/data-table-pagination'
import { DataTableFacetedFilter } from '@/app/components/datatable-faceted-filter'
import TablesLoading from '@/app/components/TablesLoading'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogTrigger } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { useGetVentaCategories } from '@/app/services/queries/venta_categoria'
import { useGetVentaProductos } from '@/app/services/queries/venta_producto'

import Delete from './Delete'
import ModalVentaProducto from './ModalVentaProducto'
import { ProductCard } from './ProductCard'
import { UpdateVentaProducto } from './Update'
import UploadImage from '@/app/(admin)/admin/venta_producto/_components/UploadImage'

export function VentaProductoTable() {
  const { productos, isLoading, isFetching } = useGetVentaProductos()
  const { categories } = useGetVentaCategories()
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [isUpdate, setIsUpdate] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [ventaIsOpen, setVentaIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('ventaProductoTableColumnsVisibility')
    if (saved) {
      setColumnVisibility(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('ventaProductoTableColumnsVisibility', JSON.stringify(columnVisibility))
    }
  }, [columnVisibility, isClient])

  useEffect(() => {
    if (!isLoading && productos) {
      setFilteredData(productos)
    }
  }, [isLoading, isFetching, productos])

  const categoryOptions = categories.map((cat) => ({ label: cat.nombre, value: String(cat.id) }))

  const columns = useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        id: 'nombre',
        accessorKey: 'nombre',
        header: 'Nombre',
        enableHiding: false,
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
        meta: { name: 'Nombre' },
      },
      {
        id: 'sku',
        accessorKey: 'sku',
        header: 'SKU',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
        meta: { name: 'SKU' },
      },
      {
        id: 'precio',
        accessorKey: 'precio',
        header: 'Precio',
        cell: (info) => `$${info.getValue()}`,
        meta: { name: 'Precio' },
      },
      {
        id: 'cantidad',
        accessorKey: 'cantidad',
        header: 'Cantidad',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => value.includes(String(row.getValue(id))),
        meta: { name: 'Cantidad' },
      },
      {
        id: 'categoria',
        accessorKey: 'categoria',
        header: 'Categoría',
        cell: (info) => info.row.original.categoria?.nombre || 'Sin categoría',
        filterFn: (row, id, value: string[]) => value.includes(String(row.original.categoria?.id)),
        meta: { name: 'Categoría' },
      },
      {
        id: 'imagen',
        accessorKey: 'imagen',
        header: 'Imagen',
        cell: (info) =>
          info.getValue() ? (
            <Image
              urlEndpoint="https://ik.imagekit.io/a9uh8fwlt/"
              src={info.row.original.imagen}
              alt={info.row.original.nombre}
              className="truncate object-contain"
              width={48}
              height={48}
            />
          ) : (
            <Badge variant="outline">Sin imagen</Badge>
          ),
        meta: { name: 'Imagen' },
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setModalData(row.original)
                setIsUpdate(true)
                setUpdateIsOpen(true)
              }}
            >
              <LuPencil size={16} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteIsOpen(true)
                setModalData(row.original)
              }}
            >
              <MdDelete color="#F74D4D" size={18} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setModalData(row.original)
                setVentaIsOpen(true)
              }}
            >
              <span role="img" aria-label="Vender">
                🛒
              </span>
            </Button>
          </div>
        ),
        meta: { name: 'Acciones' },
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading || isFetching) {
    return <TablesLoading />
  }

  const clearSearchInput = () => {
    if (searchRef.current) {
      searchRef.current.value = ''
      table.setGlobalFilter('')
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/ventas">
          <Button variant="outline">Ver historial de ventas</Button>
        </Link>
      </div>
      <div className="mb-4 flex gap-2">
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          onClick={() => setViewMode('table')}
        >
          Tabla
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          onClick={() => setViewMode('cards')}
        >
          Cartas
        </Button>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="float-end mb-4 h-12 w-48 rounded-md"
            onClick={() => {
              setModalData(null)
              setIsUpdate(false)
              setUpdateIsOpen(true)
            }}
          >
            Agregar producto
          </Button>
        </DialogTrigger>
        {updateIsOpen && (
          <UpdateVentaProducto
            open={updateIsOpen}
            onClose={() => setUpdateIsOpen(false)}
            categories={categories}
            initialData={modalData}
            isUpdate={isUpdate}
          />
        )}
        {deleteIsOpen && (
          <Delete open={deleteIsOpen} onClose={() => setDeleteIsOpen(false)} id={modalData?.id} />
        )}
        {ventaIsOpen && (
          <ModalVentaProducto
            open={ventaIsOpen}
            onClose={() => setVentaIsOpen(false)}
            producto={modalData}
          />
        )}
      </Dialog>
      <div className="flex items-center justify-between gap-x-4 py-4">
        <div className="flex w-full flex-col items-start gap-2 md:w-fit md:flex-row md:items-center">
          <div className="relative w-full">
            <Input
              ref={searchRef}
              placeholder="Buscar..."
              onChange={(event) => {
                table.setGlobalFilter(event.target.value)
              }}
              className="h-8 w-full md:w-[250px]"
            />
            {searchRef.current && searchRef.current?.value.length > 0 && (
              <LuX
                onClick={clearSearchInput}
                className="absolute right-0 top-0 m-2 size-4 text-muted-foreground hover:cursor-pointer"
              />
            )}
          </div>
          <DataTableFacetedFilter
            column={table.getColumn('categoria')}
            title="Categoría"
            options={categoryOptions}
          />
          <DataTableFacetedFilter
            column={table.getColumn('nombre')}
            title="Nombre"
            options={productos.map((p: any) => ({ label: p.nombre, value: p.nombre }))}
          />
          <DataTableFacetedFilter
            column={table.getColumn('sku')}
            title="SKU"
            options={productos.map((p: any) => ({ label: p.sku, value: p.sku }))}
          />
        </div>
      </div>
      {viewMode === 'table' ? (
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
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center text-nowrap'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredData.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onVenta={() => {
                setModalData(producto)
                setVentaIsOpen(true)
              }}
              onEdit={() => {
                setModalData(producto)
                setIsUpdate(true)
                setUpdateIsOpen(true)
              }}
              onDelete={() => {
                setDeleteIsOpen(true)
                setModalData(producto)
              }}
            />
          ))}
        </div>
      )}
      <DataTablePagination table={table} />
    </div>
  )
}
