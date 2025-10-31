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
import { useRoles } from '@/app/services/queries/rol'
import { RoleType } from '@/app/types/role'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CreateRole from './CreateRole'
import DeleteRole from './DeleteRole'
import UpdateRole from './UpdateRole'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleType>()
  const { roles, isLoading, isFetching } = useRoles()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<RoleType[]>([])

  useEffect(() => {
    if (!isLoading && roles) {
      setFilteredData(roles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<RoleType, unknown>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'nombre',
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: (info) => info.getValue(),
      },
      {
        id: 'FechaCreacion',
        accessorKey: 'FechaCreacion',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div>
            {!!row.getValue('FechaCreacion') && format(row.getValue('FechaCreacion'), 'dd/MM/yyyy')}
          </div>
        ),
      },
      {
        id: 'rol_modulo',
        accessorKey: 'rol_modulo',
        header: 'Modulos',
        cell: ({ row }) => {
          const moduleItems: { cmodulo: { nombre: string } }[] = row.getValue('rol_modulo')
          if (row.getValue('nombre') === 'Admin') return 'Todos'
          return (
            <div className="text-xs font-medium">
              {moduleItems.map(
                (e, index) => `${e.cmodulo.nombre}${index < moduleItems.length - 1 ? ', ' : ''}`
              )}
            </div>
          )
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
                  setSelectedRole(row.original as RoleType)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelectedRole(row.original as RoleType)
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
              roles.filter((d) =>
                d.nombre.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
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
              <CreateRole open={createIsOpen} onClose={() => setCreateIsOpen(false)} />
            )}
            {updateIsOpen && (
              <UpdateRole
                open={updateIsOpen}
                onClose={() => setUpdateIsOpen(false)}
                role={selectedRole}
              />
            )}
            {deleteIsOpen && (
              <DeleteRole
                id={selectedRole?.id}
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
