"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import {ChevronDownIcon, Download, Settings} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {PartnerMembershipType} from "@/app/types/partner_membership";
import {format} from "date-fns"
import Link from "next/link"
import {useAllSociomembershipsActive} from "@/app/services/queries/membership";
import * as XLSX from 'xlsx'
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {type DateRange} from 'react-day-picker'
import {MdArrowDownward, MdArrowUpward} from "react-icons/md"


export const columns: ColumnDef<PartnerMembershipType>[] = [
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
]

export function PaymentTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const {sociomemberships, isLoading, isFetching} = useAllSociomembershipsActive()
    const [filteredData, setFilteredData] = useState<PartnerMembershipType[]>([])
    const [range, setRange] = useState<DateRange | undefined>(undefined)

    useEffect(() => {
        if (!isLoading && sociomemberships) {
            setFilteredData(sociomemberships)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isFetching, filteredData.length == 0])

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

    function downloadPayments(filters = false) {
        const workbook = XLSX.utils.book_new();
        const toMap = filters ? filteredData : sociomemberships
        const name = filters ? 'Listado de pagos - Registros filtrados' : 'Listado de pagos - Todos los registros'

        /** all is a leaf */
        const all = XLSX.utils.aoa_to_sheet([
            ["DNI", "Socio", "Correo", "Membresía", "Estado", "Pago realizado", "Importe", "Duración", "Vence"],
            ...toMap.map((m) => [
                m.socio?.DNI,
                m.socio?.Nombre + ' ' + m.socio?.Paterno + ' ' + m.socio?.Materno,
                m.socio?.correo,
                m.membresia?.Nombre,
                m.estadoMembresia,
                m.FechaPago,
                m.membresia?.Precio,
                m.ctipomembresia?.nombre,
                m.Vencimiento,
            ]),
        ]);
        XLSX.utils.book_append_sheet(workbook, all, "Sheet1");

        /** Package and Release Data (`writeFile` tries to write and save an XLSB file) */
        XLSX.writeFile(workbook, `${name}.xlsx`);
    }

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <div className={'flex flex-row gap-6 items-center'}>
                    <div className={'flex flex-row gap-6 items-center'}>
                        <div className={'flex flex-col gap-2 items-start w-50'}>
                            <Label htmlFor='dni'
                                   className={'flex justify-center items-center'}>
                                Filtrar por DNI...
                            </Label>
                            <Input
                                id='dni'
                                placeholder="3617662..."
                                value={(table.getColumn("dni")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("dni")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div className={'flex flex-col gap-2 items-start w-50'}>
                            <Label htmlFor='socio'
                                   className={'flex justify-center items-center'}>
                                Filtrar por socio...
                            </Label>
                            <Input
                                id='socio'
                                placeholder="Sofía..."
                                value={(table.getColumn("Socio")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("Socio")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div className={'flex flex-col gap-2 items-start w-50'}>
                            <Label htmlFor='correo'
                                   className={'flex justify-center items-center'}>
                                Filtrar por correo...
                            </Label>
                            <Input
                                id='correo'
                                placeholder="Filtrar por correo..."
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                    </div>

                    <div className={'flex flex-col gap-2 items-start'}>
                        <div className='w-[250px] max-w-xs'>
                            <Label htmlFor='dates' className='px-1'>
                                Filtrar por rango de fecha...
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild className="rounded-md">
                                    <Button variant='outline' id='dates'
                                            className='w-full gap-2 flex flex-row font-normal items-center'>
                                        {range?.from && range?.to
                                            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                                            : 'Seleccionar rango de fecha'}
                                        <ChevronDownIcon size={16}/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto overflow-hidden p-0'
                                                align='start'>
                                    <Calendar
                                        mode='range'
                                        selected={range}
                                        onSelect={range => {
                                            setRange(range)


                                        }}
                                        onDayBlur={() => {
                                            if (range && range.from && range.to) {
                                                const from = new Date(range?.from)
                                                const to = new Date(range?.to)
                                                setFilteredData(
                                                    filteredData.filter(
                                                        (d) => {
                                                            return from <= d.FechaPago && d.FechaPago <= to
                                                        }
                                                    )
                                                )
                                            }

                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                </div>

                <div className="flex flex-row gap-2">
                    <Button
                        onClick={() => downloadPayments()}
                        className="rounded-sm bg-gradient-to-bl from-amber-500 text-white to-primary-foreground gap-2 text-xs"
                    >
                        <Download size={16}/>
                        Todos los registros
                    </Button>

                    <Button
                        onClick={() => downloadPayments(true)}
                        className="rounded-sm bg-gradient-to-bl from-amber-500 text-white to-primary-foreground gap-2 text-xs"
                    >
                        <Download size={16}/>
                        Registros filtrados
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No existen resultados para los datos introducidos
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredRowModel().rows.length} registros.
                </div>
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
