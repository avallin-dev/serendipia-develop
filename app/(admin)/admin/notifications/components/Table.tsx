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
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdDelete, MdEditDocument } from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { useNotification } from '@/app/services/queries/notification'
import { NotificationType } from '@/app/types/notification'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CreateNotification from './CreateNotification'
import DeleteNotification from './DeleteNotification'
import UpdateNotification from './UpdateNotification'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selected, setSelected] = useState<NotificationType>()
  const { notifications, isLoading, isFetching } = useNotification()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<NotificationType[]>([])

  useEffect(() => {
    if (!isLoading && notifications) {
      setFilteredData(notifications)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<NotificationType, unknown>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Titulo',
        cell: (info) => info.getValue(),
      },
      {
        id: 'general',
        accessorKey: 'general',
        header: 'General',
        cell: ({ row }) => <div>{row.getValue('general') ? 'General' : 'Individual'}</div>,
      },
      {
        id: 'externalLink',
        accessorKey: 'externalLink',
        header: 'Link',
        cell: ({ row }) => {
          const externalLink = row.getValue('externalLink')
          if (externalLink)
            return (
              <Link
                target="_blank"
                href={externalLink}
                className="font-semibold text-blue-800 underline"
              >
                {row.getValue('externalLink')}
              </Link>
            )
        },
      },
      {
        id: 'user',
        accessorKey: 'user',
        header: 'Socio',
        cell: ({ row }) => {
          const partner: { Nombre: string; Paterno: string } = row.getValue('user')
          return <div>{partner ? `${partner.Nombre} ${partner.Paterno}` : ''}</div>
        },
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUpdateIsOpen(true)
                  setSelected(row.original as NotificationType)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelected(row.original as NotificationType)
                }}
              >
                <MdDelete color="#F74D4D" size={18} />
              </Button>
            </div>
          )
        },
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
      <div className="flex items-center justify-end gap-x-4 py-4">
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setCreateIsOpen(true)}>
                Crear
              </Button>
            </DialogTrigger>
            {createIsOpen && (
              <CreateNotification open={createIsOpen} onClose={() => setCreateIsOpen(false)} />
            )}
            {updateIsOpen && (
              <UpdateNotification
                open={updateIsOpen}
                onClose={() => setUpdateIsOpen(false)}
                selected={selected}
              />
            )}
            {deleteIsOpen && (
              <DeleteNotification
                id={selected?.id}
                open={deleteIsOpen}
                onClose={() => setDeleteIsOpen(false)}
              />
            )}
          </Dialog>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md shadow-md">
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
    </div>
  )
}
