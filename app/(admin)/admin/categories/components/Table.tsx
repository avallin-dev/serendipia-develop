'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdDelete, MdEditDocument } from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { useCategory } from '@/app/services/queries/category'
import { CategoryType } from '@/app/types/category'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import CreateCategory from './CreateCategory'
import DeleteCategory from './DeleteCategory'
import UpdateCategory from './UpdateCategory'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>()
  const { categories, isLoading, isFetching } = useCategory()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<CategoryType[]>([])

  useEffect(() => {
    if (!isLoading && categories) {
      setFilteredData(categories)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<CategoryType, unknown>[]>(
    () => [
      {
        id: 'idCategoria',
        accessorKey: 'idCategoria',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'nombreCat',
        accessorKey: 'nombreCat',
        header: 'Nombre de Categoria',
        cell: (info) => info.getValue(),
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
                  setSelectedCategory(row.original as CategoryType)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelectedCategory(row.original as CategoryType)
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
              <CreateCategory open={createIsOpen} onClose={() => setCreateIsOpen(false)} />
            )}
            {updateIsOpen && (
              <UpdateCategory
                open={updateIsOpen}
                onClose={() => setUpdateIsOpen(false)}
                category={selectedCategory}
              />
            )}
            {deleteIsOpen && (
              <DeleteCategory
                id={selectedCategory?.idCategoria}
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
    </div>
  )
}
