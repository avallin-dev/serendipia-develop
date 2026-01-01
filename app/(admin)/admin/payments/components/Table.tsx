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
import React, {ChangeEvent, useEffect, useMemo, useState} from 'react'
import {MdArrowDownward, MdArrowUpward} from 'react-icons/md'

import TablesLoading from '@/app/components/TablesLoading'
import {Button} from '@/app/components/ui/button'
import {Input} from '@/app/components/ui/input'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {PartnerMembershipType} from "@/app/types/partner_membership";
import {useAllSociomembershipsActive} from "@/app/services/queries/membership";
import Link from "next/link"
import {Settings} from "lucide-react"
import {Label} from "@/components/ui/label";
import {toast} from "sonner"

export default function TableMembership() {
    const {sociomemberships, isLoading, isFetching} = useAllSociomembershipsActive()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [startDate, setstartDate] = useState(new Date(Date.now()));
    const [endDate, setendDate] = useState(new Date(Date.now()));
    const [dni, setDNI] = useState<number>(0x00000)
    const [name, setName] = useState<string>('nombre')
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
                }, {
                    id: 'FechaPago',
                    accessorKey: 'FechaPago',
                    header: 'Pago realizado',
                    cell: ({row}) => (
                        <div>
                            {!!row.getValue('FechaPago') && format(row.getValue('FechaPago'), 'dd/MM/yyyy')}
                        </div>
                    ),
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

    function initData() {
        setFilteredData(sociomemberships)
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-x-4 py-4">
                <div className="flex items-center gap-x-8 py-4">
                    <div className={'flex flex-col gap-2'}>
                        <Label htmlFor='FindDNI'>Buscar por DNI de Socio</Label>
                        <Input
                            placeholder="35695147"
                            id='FindDNI'
                            className="max-w-60"
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                setDNI(Number(e.target.value))
                                initData()
                                setFilteredData(
                                    filteredData?.filter(
                                        (d) => d.socio?.DNI?.toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                                    )
                                )
                            }}
                        /></div>
                    <div className={'flex flex-col gap-2'}>
                        <Label htmlFor='FindSocio'>Buscar por Nombre de Socio</Label>
                        <Input
                            placeholder="262518523.."
                            id='FindSocio'
                            className="w-[200px] py-0 px-1"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setName(e.target.value)
                                initData()
                                setFilteredData(
                                    filteredData?.filter(
                                        (d) => d.socio?.Nombre?.toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                                    ).filter((s)=> s.FechaPago > startDate)
                                )
                            }}
                        />
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <Label htmlFor='DatePickerInput'
                               className={'flex justify-center items-center'}>
                            Seleccionar Rango de Fechas
                        </Label>
                        <div className="flex items-center gap-x-4 flex-row" id='DatePickerInput'>

                            <Input
                                placeholder="Buscar por Fecha.."
                                type='date'
                                value={format(startDate, 'yyyy-MM-dd')}
                                className="max-w-120"
                                max={format(new Date(Date.now()), 'yyyy-MM-dd')}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setstartDate(new Date(e.target.value))
                                    initData()
                                    setFilteredData(
                                        filteredData?.filter(d =>
                                            d.FechaPago > new Date(e.target.value)
                                        )
                                    )

                                }}
                            />
                            <Input
                                placeholder="Buscar por Fecha.."
                                type='date'
                                value={format(endDate, 'yyyy-MM-dd')}
                                max={format(new Date(Date.now()), 'yyyy-MM-dd')}
                                className="max-w-120"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setendDate(new Date(e.target.value))
                                    initData()
                                    setFilteredData(
                                        filteredData.filter(
                                            (d) =>
                                                d.FechaPago < new Date(e.target.value)
                                        )
                                    )
                                }}
                            />
                        </div>
                    </div>
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
                            toast.info('No existen datos con los parámetros seleccionados. ' + 'Se muestran todos los datos')
                            // filteredData.length== 0 ? toast.success('No existen datos con esos parámetros') : ''

                            // <TableRow>
                            //     <TableCell colSpan={columns.length}
                            //                className="text-center text-chicago-600">
                            //         Sin resultados
                            //     </TableCell>
                            //
                            // </TableRow>
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


