'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdDelete, MdEditDocument } from 'react-icons/md'

import DeleteRoutine from '@/app/(admin)/admin/routines/components/DeleteRoutine'
import UpdateRoutine from '@/app/(admin)/admin/routines/components/UpdateRoutine'
import RoutineCard from '@/app/(dashboard)/_components/routine-card-hover'
import TablesLoading from '@/app/components/TablesLoading'
import { Button } from '@/app/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { useRoutinesByPlan } from '@/app/services/queries/routine'
import { RoutineWithExerciseType } from '@/app/types/routine'
import determineCodeType from '@/app/utils/determineCodeType'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TableRoutines({
  id,
  semanas,
  selectedType,
}: {
  id: number
  semanas?: number | null
  selectedType: 'socio' | 'grupo' | 'bloque'
}) {
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [selectedExercise, setSelectedExercice] = useState<RoutineWithExerciseType>()
  const { routines, isLoading, isFetching } = useRoutinesByPlan(id)
  const [isUpdate, setIsUpdate] = useState(false)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<RoutineWithExerciseType[]>([])

  useEffect(() => {
    if (!isLoading && routines) {
      setData(routines)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  type SemanaKeys =
    | `repeticionS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
    | `comentarioS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

  const columnHelper = createColumnHelper<RoutineWithExerciseType>()
  const columnGroupWeeks = Array.from({ length: semanas! }, (_, i) => {
    const semana = i + 1
    return columnHelper.group({
      id: `semana${semana}`,
      header: `Semana ${semana}`,
      columns: [
        columnHelper.accessor((row) => row[`repeticionS${semana}` as SemanaKeys], {
          header: () => 'Series-Rep',
          id: `repeticionS${semana}`,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor((row) => row[`comentarioS${semana}` as SemanaKeys], {
          header: () => 'Comentario',
          id: `comentarioS${semana}`,
          cell: (info) => info.getValue(),
        }),
      ],
    })
  })
  const columns = useMemo<ColumnDef<RoutineWithExerciseType, unknown>[]>(
    () => [
      {
        id: 'dia',
        accessorKey: 'dia',
        header: 'Dia',
        cell: (info) => info.getValue(),
      },
      {
        id: 'nroEjercicio',
        accessorKey: 'nroEjercicio',
        header: 'Nro Ej',
        cell: ({ row }) => <div className="uppercase">{row.getValue('nroEjercicio')}</div>,
      },
      {
        id: 'ejercicios',
        accessorKey: 'ejercicios',
        header: 'Nombre ejercicio',
        cell: ({ row }) => {
          const routine = row.original
          const codeNro = determineCodeType(routine?.nroEjercicio)
          const codeBorderColor = {
            odd: 'outline-primary',
            even: 'outline-white',
            rare: 'outline-magenta',
          }
          const codeBgColor = {
            odd: 'bg-primary',
            even: 'bg-white',
            rare: 'bg-magenta',
          }
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="block" asChild>
                  <div className="cursor-pointer">{routine.ejercicios.nombreEj}</div>
                </TooltipTrigger>
                <TooltipContent className="bg-transparent">
                  <RoutineCard
                    comment={routine.comentarioS1}
                    exerciseName={routine.ejercicios.nombreEj}
                    exerciseNo={routine.nroEjercicio!}
                    codeBorderColor={codeBorderColor[codeNro]}
                    codeBgColor={codeBgColor[codeNro]}
                    repetitions={routine.repeticionS1}
                    videoLink={routine.ejercicios.linkEj}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      ...columnGroupWeeks,
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
                  setIsUpdate(true)
                  setSelectedExercice(row.original as RoutineWithExerciseType)
                }}
              >
                <MdEditDocument color="#1A4E74" size={18} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteIsOpen(true)
                  setSelectedExercice(row.original as RoutineWithExerciseType)
                }}
              >
                <MdDelete color="#F74D4D" size={18} />
              </Button>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [semanas]
  )

  const table = useReactTable({
    data: data,
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
      <div className="flex items-center justify-end gap-x-4 pb-4">
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="h-12 w-48 rounded-md"
                onClick={() => {
                  setUpdateIsOpen(true)
                  setIsUpdate(false)
                }}
              >
                Agregar rutina
              </Button>
            </DialogTrigger>
            {updateIsOpen && (
              <UpdateRoutine
                open={updateIsOpen}
                onClose={() => {
                  setUpdateIsOpen(false)
                  setIsUpdate(false)
                }}
                idPlan={id}
                routine={selectedExercise}
                semanas={semanas}
                selectedType={selectedType}
                isUpdate={isUpdate}
              />
            )}
            {deleteIsOpen && (
              <DeleteRoutine
                id={selectedExercise?.idRutina}
                planId={selectedExercise?.idPlan}
                open={deleteIsOpen}
                onClose={() => setDeleteIsOpen(false)}
              />
            )}
          </Dialog>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-md shadow-md">
        <Table>
          <TableHeader className="bg-alto-200 text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border text-center font-bold text-chicago-600 first:pl-5"
                    colSpan={header.colSpan}
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const codeBgColor = {
                  odd: 'bg-primary',
                  even: 'bg-white',
                  rare: 'bg-magenta',
                }
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`${
                      codeBgColor[determineCodeType(row.getValue('nroEjercicio'))]
                    } hover:${codeBgColor[determineCodeType(row.getValue('nroEjercicio'))]}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="first:pl-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
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
