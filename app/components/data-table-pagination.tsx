'use client'

import { Table } from '@tanstack/react-table'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export default function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageSizes = Array.from(new Set([5, 10, 15, table.getFilteredRowModel().rows.length]))
  const currentPage = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  const maxPageButtons = 5

  const getPageNumbers = () => {
    const pages: number[] = []
    const startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(pageCount - 1, startPage + maxPageButtons - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (startPage > 0) {
      pages.unshift(0)
    }
    if (endPage < pageCount - 1) {
      pages.push(pageCount - 1)
    }

    return Array.from(new Set(pages))
  }

  return (
    <div className="mt-3 flex items-center px-2">
      <div className="flex flex-1 items-center justify-between space-x-6 lg:space-x-8">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: string) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[120px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <FaChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((pageIndex) => (
              <Button
                key={pageIndex}
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(pageIndex)}
                disabled={currentPage === pageIndex}
              >
                {pageIndex + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <FaChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
