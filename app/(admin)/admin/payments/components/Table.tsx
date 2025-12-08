'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'
import {format} from 'date-fns'
import {ChangeEvent, useEffect, useMemo, useState} from 'react'
import {MdArrowDownward, MdArrowUpward} from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import {Button} from '@/app/components/ui/button'
import {Input} from '@/app/components/ui/input'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {PartnerMembershipType} from "@/app/types/partner_membership";
import {useAllSociomembershipsActive} from "@/app/services/queries/membership";
import Link from "next/link"
import {Settings} from "lucide-react"

export default function TableMembership() {
    const {sociomemberships, isLoading, isFetching} = useAllSociomembershipsActive()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [filteredData, setFilteredData] = useState<PartnerMembershipType[]>([])

    useEffect(() => {
        if (!isLoading && sociomemberships) {
            setFilteredData(sociomemberships)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isFetching, filteredData.length == 0])

    const columns = useMemo<ColumnDef<PartnerMembershipType, unknown>[]>(
        () => {
            return [
                {
                    id: 'dni',
                    accessorKey: 'socio.DNI',
                    header: 'DNI',
                    cell: (info) => info.getValue(),
                },
                {
                    id: 'Socio',
                    accessorKey: 'socio.Nombre',
                    header: 'Socio',
                    cell: ({row}) => (
                        <div>
                            {row.original.socio?.Nombre} {row.original.socio?.Paterno} {row.original.socio?.Materno}
                        </div>)
                },
                {
                    id: 'email',
                    accessorKey: 'socio.correo',
                    header: 'Correo',
                    cell: (info) =>
                        info.getValue() != '' ? info.getValue() : 'Correo no agregado'
                },
                {
                    id: 'Membresia',
                    accessorKey: 'membresia',
                    header: 'Membresía',
                    cell: ({row}) => (
                        <div>
                            {row.original.membresia?.Nombre}
                        </div>)
                },
                {
                    id: 'Estado',
                    accessorKey: 'estadoMembresia',
                    header: 'Estado',
                    cell: (info) => info.getValue(),
                },
                {
                    id: 'Importe',
                    accessorKey: 'membresia.Precio',
                    header: 'Importe',
                    cell: (info) => info.getValue(),
                },
                {
                    id: 'Duracion',
                    accessorKey: 'ctipomembresia.nombre',
                    header: 'Duración',
                    cell: (info) => info.getValue(),
                },
                {
                    id: 'FechaVencimiento',
                    accessorKey: 'Vencimiento',
                    header: 'Vence',
                    cell: ({row}) => (
                        <div>
                            {!!row.getValue('FechaVencimiento') && format(row.getValue('FechaVencimiento'), 'dd/MM/yyyy')}
                        </div>
                    ),
                },
                {
                    id: 'actions',
                    header: 'Acciones',
                    cell: ({row}) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <Link href={{
                                    pathname: '/admin/partner',
                                    query: {partner: row.original.socio?.idSocio}
                                }}>
                                    <Settings className="h-5 w-5 text-gray-200 fill-blue-700"/>
                                </Link>
                            </div>
                        )
                    },
                },
            ];
        },
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
        return <TablesLoading/>
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-x-4 py-4">
                <div className="flex items-center gap-x-4 py-4">
                    <Input
                        placeholder="Buscar por DNI.."
                        className="max-w-60"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFilteredData(
                                filteredData?.filter(
                                    (d) => d.socio?.DNI?.toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                                )
                            )
                        }}
                    />
                    <Input
                        placeholder="Buscar por Socio.."
                        className="max-w-60"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFilteredData(
                                filteredData?.filter(
                                    (d) => d.socio?.Nombre?.toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                                )
                            )
                        }}
                    />
                    <Input
                        placeholder="Buscar por Fecha.."
                        className="max-w-60"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFilteredData(
                                filteredData?.filter(
                                    (d) => format(d.Vencimiento, 'dd/MM/yyyy').toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                                )
                            )
                        }}
                    />
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
                                                        asc: <MdArrowUpward/>,
                                                        desc: <MdArrowDownward/>,
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
                                <TableRow key={row.id}
                                          data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="first:pl-5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}
                                           className="text-center text-chicago-600">
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
