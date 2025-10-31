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
import { useEffect, useMemo, useRef, useState } from 'react'
import { LuPencil, LuSlidersHorizontal, LuX } from 'react-icons/lu'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

import DataTablePagination from '@/app/components/data-table-pagination'
import { DataTableFacetedFilter } from '@/app/components/datatable-faceted-filter'
import TablesLoading from '@/app/components/TablesLoading'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Dialog } from '@/app/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { Input } from '@/app/components/ui/input'
import { useSociosConPlan } from '@/app/services/queries/seguimiento_planes'
import { useAllUsers } from '@/app/services/queries/user'
import { SeguimientoPlanesType } from '@/app/types/seguimiento_plantes'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import SelectStatePlan from './SelectStatePlan'
import UpdateComments from './UpdateComments'

export default function TableSeguimientoPlanes() {
  const [selectedPlan, setSelectedPlan] = useState<SeguimientoPlanesType>()
  const { sociosConPlan, isLoading, isFetching } = useSociosConPlan()
  const searchRef = useRef<HTMLInputElement>(null)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)

  const grupos = useMemo(() => {
    if (!sociosConPlan) return []
    const gruposUnicos = new Set(sociosConPlan.map((socio) => socio.grupo))
    return Array.from(gruposUnicos).map((grupo) => ({
      label: grupo,
      value: grupo,
    }))
  }, [sociosConPlan])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filteredData, setFilteredData] = useState<SeguimientoPlanesType[]>([])
  const { users } = useAllUsers()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('tableColumnsVisibility')
    if (saved) {
      setColumnVisibility(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tableColumnsVisibility', JSON.stringify(columnVisibility))
    }
  }, [columnVisibility, isClient])

  useEffect(() => {
    if (!isLoading && sociosConPlan) {
      setFilteredData(sociosConPlan)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const columns = useMemo<ColumnDef<SeguimientoPlanesType, unknown>[]>(
    () => [
      {
        id: 'profesor',
        accessorKey: 'profesor',
        header: 'Profesor',
        enableHiding: false,
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Profesor',
        },
      },
      {
        id: 'nombreSocio',
        accessorKey: 'nombreSocio',
        header: 'Nombre',
        enableHiding: false,
        cell: (info) => (
          <div className="flex items-center gap-2">
            {String(info.getValue())}
            {info.row.original.shouldChangePlan && (
              <Badge
                variant="destructive"
                className="text-nowrap px-1.5"
                style={{ fontSize: '10px' }}
              >
                Cambiar plan
              </Badge>
            )}
          </div>
        ),
        meta: {
          name: 'Nombre',
        },
      },
      {
        id: 'condicionMedica',
        accessorKey: 'condicionMedica',
        header: 'Patología',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Patología',
        },
      },
      {
        id: 'observaciones',
        accessorKey: 'observaciones',
        header: 'Comentario de patologías',
        cell: (info) => info.getValue(),
        meta: {
          name: 'Comentario de patologías',
        },
      },
      {
        id: 'type_of_training',
        accessorKey: 'type_of_training',
        header: 'Tipo de entrenamiento',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Tipo de entrenamiento',
        },
      },
      {
        id: 'nivel',
        accessorKey: 'nivel',
        header: 'Nivel',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Nivel',
        },
      },
      {
        id: 'grupo',
        accessorKey: 'grupo',
        header: 'Grupo',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Grupo',
        },
      },
      {
        id: 'nombrePlan',
        accessorKey: 'nombrePlan',
        enableHiding: false,
        header: 'Plan',
        cell: (info) => info.getValue(),
        meta: {
          name: 'Plan',
        },
      },
      {
        id: 'comments',
        accessorKey: 'comments',
        header: 'Comentario',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {!!row.getValue('comments') && row.getValue('comments')}
            <Button
              onClick={() => {
                setSelectedPlan(row.original)
                setUpdateIsOpen(true)
              }}
              size="icon"
              variant="ghost"
            >
              <LuPencil size={14} />
            </Button>
          </div>
        ),
        meta: {
          name: 'Comentario',
        },
      },
      {
        id: 'progreso',
        accessorKey: 'progreso',
        header: 'Progreso',
        cell: (info) => String(info.getValue()) + '%',
        meta: {
          name: 'Progreso',
        },
      },
      {
        id: 'state',
        accessorKey: 'state',
        enableHiding: false,
        header: 'Estado',
        cell: ({ row }) => (
          <SelectStatePlan defaultState={row.getValue('state')} idPlan={row.original.idPlan} />
        ),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id))
        },
        meta: {
          name: 'Estado',
        },
      },
      {
        id: 'fechaInicio',
        accessorKey: 'fechaInicio',
        header: 'Fecha Inicio',
        cell: ({ row }) => (
          <div>{!!row.getValue('fechaInicio') && format(row.getValue('fechaInicio'), 'dd/MM')}</div>
        ),
        meta: {
          name: 'Fecha Inicio',
        },
      },
      {
        id: 'fechaFin',
        accessorKey: 'fechaFin',
        header: 'Fecha Fin',
        cell: ({ row }) => (
          <div>{!!row.getValue('fechaFin') && format(row.getValue('fechaFin'), 'dd/MM')}</div>
        ),
        meta: {
          name: 'Fecha Fin',
        },
      },
      {
        id: 'semanas',
        accessorKey: 'semanas',
        header: 'Semanas',
        cell: (info) => info.getValue(),
        meta: {
          name: 'Semanas',
        },
      },
      {
        id: 'dias',
        accessorKey: 'dias',
        header: 'Días',
        cell: (info) => info.getValue(),
        meta: {
          name: 'Días',
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

  const clearSearchInput = () => {
    if (searchRef.current) {
      searchRef.current.value = ''
      table.setGlobalFilter('')
    }
  }

  const profesorType = [
    {
      label: 'Desconocido',
      value: 'Desconocido',
    },
    ...(users?.map((user) => ({
      label: user.Usuario || '',
      value: user.Usuario || '',
    })) || []),
  ]

  const statusType = [
    {
      label: 'Actualizar',
      value: 'actualizar',
    },
    {
      label: 'En Proceso',
      value: 'en_proceso',
    },
    {
      label: 'Ok',
      value: 'ok',
    },
  ]

  const type_of_training = [
    {
      label: 'Salud Estética',
      value: 'Salud_Estetico',
    },
    {
      label: 'Deporte',
      value: 'Deporte',
    },
    {
      label: 'Concurrente Funcional',
      value: 'Concurrente_Funcional',
    },
    {
      label: 'Desconocido',
      value: 'Desconocido',
    },
  ]

  const level = [
    {
      label: 'AVANZADO',
      value: 'AVANZADO',
    },
    {
      label: 'INTERMEDIO',
      value: 'INTERMEDIO',
    },
    {
      label: 'INICIAL',
      value: 'INICIAL',
    },
  ]

  const condicionesMedicas = [
    { value: 'Cervical', label: 'Cervical' },
    { value: 'Hombro', label: 'Hombro' },
    { value: 'Espalda baja', label: 'Espalda baja' },
    { value: 'Cadera', label: 'Cadera' },
    { value: 'Rodilla', label: 'Rodilla' },
    { value: 'Tobillo', label: 'Tobillo' },
    { value: 'Codo', label: 'Codo' },
    { value: 'Muñeca', label: 'Muñeca' },
    { value: 'Hipertensión', label: 'Hipertensión' },
    { value: 'Hiperlaxo', label: 'Hiperlaxo' },
  ]

  const profesorColumn = !!table.getAllColumns().find((column) => column.id === 'profesor')
  const statusColumn = !!table.getAllColumns().find((column) => column.id === 'state')

  return (
    <div className="w-full">
      <Dialog>
        {updateIsOpen && (
          <UpdateComments
            open={updateIsOpen}
            onClose={() => setUpdateIsOpen(false)}
            comments={selectedPlan?.comments || ''}
            idPlan={selectedPlan?.idPlan}
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
          {profesorColumn && (
            <DataTableFacetedFilter
              column={table.getColumn('profesor')}
              title="Profesores"
              options={profesorType}
            />
          )}
          {statusColumn && (
            <DataTableFacetedFilter
              column={table.getColumn('state')}
              title="Estado"
              options={statusType}
            />
          )}
          {type_of_training && (
            <DataTableFacetedFilter
              column={table.getColumn('type_of_training')}
              title="Tipo de entrenamiento"
              options={type_of_training}
            />
          )}
          {level && (
            <DataTableFacetedFilter
              column={table.getColumn('nivel')}
              title="Nivel"
              options={level}
            />
          )}
          {grupos && (
            <DataTableFacetedFilter
              column={table.getColumn('grupo')}
              title="Grupo"
              options={grupos}
            />
          )}
          {condicionesMedicas && (
            <DataTableFacetedFilter
              column={table.getColumn('condicionMedica')}
              title="Patología"
              options={condicionesMedicas}
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="space-x-2">
              <LuSlidersHorizontal size={16} />
              <p>Columnas</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const meta = column.columnDef.meta as { name?: string } | undefined
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {meta?.name || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                              ? 'cursor-pointer select-none flex items-center text-nowrap'
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
      <DataTablePagination table={table} />
    </div>
  )
}
