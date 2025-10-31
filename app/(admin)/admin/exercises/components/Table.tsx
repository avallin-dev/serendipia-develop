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
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdDelete, MdEditDocument } from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { useExercises } from '@/app/services/queries/exercise'
import { ExerciseType } from '@/app/types/exercise'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import CreateExercise from './CreateExercise'
import DeleteExercise from './DeleteExercise'
import RoutineCard from './excercise-card-hover'
import UpdateExercise from './UpdateExercise'

export default function TableMembership() {
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedExercise, setSelectedPlan] = useState<ExerciseType>()
  const { exercises, isLoading, isFetching } = useExercises()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<ExerciseType[]>([])

  useEffect(() => {
    if (!isLoading && exercises) {
      setFilteredData(exercises)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<ExerciseType, unknown>[]>(
    () => [
      {
        id: 'idEjercicio',
        accessorKey: 'idEjercicio',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        id: 'nombreEj',
        accessorKey: 'nombreEj',
        header: 'Nombre del ejercicio',
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="block" asChild>
                <div className="cursor-pointer hover:underline">{row.getValue('nombreEj')}</div>
              </TooltipTrigger>
              <TooltipContent className="bg-transparent">
                <RoutineCard
                  exerciseName={row.getValue('nombreEj')}
                  videoLink={row.getValue('linkEj')}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        id: 'linkEj',
        accessorKey: 'linkEj',
        header: 'Link',
        cell: ({ row }) => (
          <Link
            target="_blank"
            href={row.getValue('linkEj')}
            className="font-semibold text-blue-800 underline"
          >
            {row.getValue('linkEj')}
          </Link>
        ),
      },
      {
        id: 'categoria_ej',
        accessorKey: 'categoria_ej',
        header: 'Categoria',
        cell: ({ row }) => {
          const category: { nombreCat: string | null } = row.getValue('categoria_ej')
          return category.nombreCat
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
                  setSelectedPlan(row.original as ExerciseType)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelectedPlan(row.original as ExerciseType)
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
              exercises.filter(
                (d) => d.nombreEj?.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
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
              <CreateExercise open={createIsOpen} onClose={() => setCreateIsOpen(false)} />
            )}
            {updateIsOpen && (
              <UpdateExercise
                open={updateIsOpen}
                onClose={() => setUpdateIsOpen(false)}
                exercise={selectedExercise}
              />
            )}
            {deleteIsOpen && (
              <DeleteExercise
                id={selectedExercise?.idEjercicio}
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
