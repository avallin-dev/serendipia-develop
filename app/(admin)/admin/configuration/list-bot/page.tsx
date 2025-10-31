'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'
import { useMemo, useState, ChangeEvent } from 'react'

import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { useGetSociosWithChats } from '@/app/services/queries/bot'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import ModalBotChat from '../_components/ModalBotChat'

interface SocioChat {
  idSocio: number
  nombre: string | null
  paterno: string | null
}

export default function ListBotChatsPage() {
  const { socios, isLoading, isFetching } = useGetSociosWithChats()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSocio, setSelectedSocio] = useState<SocioChat | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<SocioChat[]>([])

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setFilteredData(
      socios.filter(
        (s: SocioChat) =>
          (s.nombre?.toLowerCase() || '').includes(value) ||
          (s.paterno?.toLowerCase() || '').includes(value)
      )
    )
  }

  useMemo(() => {
    if (!isLoading && socios) {
      setFilteredData(socios)
    }
    // eslint-disable-next-line
  }, [isLoading, isFetching, socios])

  const columns = useMemo<ColumnDef<SocioChat, unknown>[]>(
    () => [
      {
        id: 'idSocio',
        accessorKey: 'idSocio',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'nombre',
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => (
          <span>
            {row.original.nombre} {row.original.paterno}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="d-flex mx-auto"
            onClick={() => {
              setSelectedSocio(row.original as SocioChat)
              setModalOpen(true)
            }}
          >
            Ver historial
          </Button>
        ),
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-x-4 py-4">
        <Input placeholder="Buscar" className="max-w-40" onChange={handleFilter} />
      </div>
      <div className="w-full overflow-x-auto rounded-md shadow-md">
        <Table>
          <TableHeader className="bg-alto-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-center font-bold text-chicago-600 first:rounded-tl-lg first:pl-5 last:rounded-tr-lg"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="first:pl-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-chicago-600">
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
      {selectedSocio && (
        <ModalBotChat
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          socioId={selectedSocio.idSocio}
          nombre={`${selectedSocio.nombre ?? ''} ${selectedSocio.paterno ?? ''}`.trim()}
        />
      )}
    </div>
  )
}
