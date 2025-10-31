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
import { format } from 'date-fns'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdDelete, MdEditDocument } from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { useAllUsers } from '@/app/services/queries/user'
import { AdminUserProfile } from '@/app/types/user'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CreateUser from './CreateUser'
import DeleteUser from './DeleteUser'
import UpdateUser from './UpdateUser'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile>()
  const { users, isLoading, isFetching } = useAllUsers()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<AdminUserProfile[]>([])

  useEffect(() => {
    if (!isLoading && users) {
      setFilteredData(users)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<AdminUserProfile, unknown>[]>(
    () => [
      {
        id: 'idUsuario',
        accessorKey: 'idUsuario',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'Usuario',
        accessorKey: 'Usuario',
        header: 'Usuario',
        cell: (info) => info.getValue(),
      },
      {
        id: 'fechaCreacion',
        accessorKey: 'fechaCreacion',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div>
            {!!row.getValue('fechaCreacion') && format(row.getValue('fechaCreacion'), 'dd/MM/yyyy')}
          </div>
        ),
      },
      {
        id: 'rol',
        accessorKey: 'rol',
        header: 'Rol',
        cell: ({ row }) => {
          const user: { nombre?: string } = row.getValue('rol')
          return <div>{user.nombre}</div>
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
                  setSelectedUser(row.original as AdminUserProfile)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelectedUser(row.original as AdminUserProfile)
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
      <div className="flex items-center justify-between gap-x-4 py-4">
        <Input
          placeholder="Buscar"
          className="max-w-40"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFilteredData(
              users.filter(
                (d) => d.Usuario?.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
              )
            )
          }}
        />
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setCreateIsOpen(true)}>
                Crear
              </Button>
            </DialogTrigger>
            {createIsOpen && (
              <CreateUser open={createIsOpen} onClose={() => setCreateIsOpen(false)} />
            )}
            {updateIsOpen && (
              <UpdateUser
                open={updateIsOpen}
                onClose={() => setUpdateIsOpen(false)}
                user={selectedUser}
              />
            )}
            {deleteIsOpen && (
              <DeleteUser
                id={selectedUser?.idUsuario}
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
