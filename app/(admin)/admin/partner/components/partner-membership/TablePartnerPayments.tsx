'use client'

import { sociomembresia } from '@prisma/client'
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
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

import ModalWrapper from '@/app/components/ModalWrapper'
import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { useMembershipPayments } from '@/app/services/queries/membership'
import { MembershipPaymentType } from '@/app/types/membership'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TablePartnerMembershipProps = {
  onClose: () => void
  open: boolean
  partnerMemberships?: sociomembresia[]
  idSocio?: number
}

export default function TablePartnerPayments({
  onClose,
  open,
  idSocio,
}: TablePartnerMembershipProps) {
  const { memberships, isLoading, isFetching } = useMembershipPayments(idSocio)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<MembershipPaymentType[]>([])

  useEffect(() => {
    if (!isLoading && memberships) {
      setFilteredData(memberships)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<MembershipPaymentType, unknown>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Nombre de membresia',
        cell: (info) => info.getValue(),
      },
      {
        id: 'estadoMembresia',
        accessorKey: 'estadoMembresia',
        header: 'Estado de Membresia',
        cell: (info) => info.getValue(),
      },
      {
        id: 'fecha',
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) =>
          row.getValue('fecha') ? format(row.getValue('fecha'), 'dd/MM/yyyy') : '',
      },
      {
        id: 'importe',
        accessorKey: 'importe',
        header: 'Importe',
        cell: ({ row }) => `$${new Intl.NumberFormat('es-ES').format(row.getValue('importe'))}`,
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const tableContent = (
    <div className="w-full overflow-x-auto rounded-md shadow-md">
      {isFetching ? (
        <TablesLoading />
      ) : (
        <Table>
          <TableHeader className="bg-alto-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                          {{
                            asc: <MdArrowUpward />,
                            desc: <MdArrowDownward />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
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
      )}
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
    </div>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Membresias del socio"
      body={tableContent}
      className="sm:max-w-5xl"
      hideFooter
    />
  )
}
