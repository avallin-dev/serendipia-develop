'use client'

import { useEffect, useState } from 'react'

import { useRoutinesByPlan } from '@/app/services/queries/routine'
import { RoutineWithExerciseType } from '@/app/types/routine'
import processString from '@/app/utils/formatSerie'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type RepeticionKeys =
  | `repeticionS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `comentarioS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

export function CategoriesTable({ semanas, idPlan }: { semanas?: number | null; idPlan?: number }) {
  const { routines, isLoading, isFetching } = useRoutinesByPlan(idPlan!)
  const [data, setData] = useState<RoutineWithExerciseType[]>([])

  useEffect(() => {
    if (!isLoading && routines) {
      setData(routines)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const categories = Array.from(
    new Set(routines?.map((routineE) => routineE.ejercicios.categoria_ej.nombreCat))
  )
  const categoryTotal = (categoryName: string) =>
    data.filter((element) => element.ejercicios.categoria_ej.nombreCat === categoryName)
  return (
    <div>
      <div>
        <div className="font-bold">Series</div>
        <Table>
          <TableHeader className="bg-gray-300">
            <TableRow className="h-[52px]">
              <TableHead className="rounded-tl-lg pl-5 font-semibold text-black">
                Categoria
              </TableHead>
              {semanas &&
                Array.from(Array.from({ length: semanas }, (_, i) => i + 1)).map(
                  (e: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number) => (
                    <TableHead
                      key={`category-${e}`}
                      className="font-semibold text-black last:rounded-tr-lg last:pr-5"
                    >
                      S-{e}
                    </TableHead>
                  )
                )}
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {categories &&
              categories.map((categoryRow) => (
                <TableRow key={`categoryRow-${categoryRow}`}>
                  <TableCell className="pl-5">{categoryRow}</TableCell>
                  {semanas &&
                    Array.from(Array.from({ length: semanas }, (_, i) => i + 1)).map(
                      (e: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number) => {
                        const routineSeries = categoryTotal(categoryRow!).map((routine) => {
                          const serie = processString(
                            routine[('repeticionS' + e) as RepeticionKeys]
                          ).series
                          const num = serie ? parseFloat(serie) : 0
                          if (serie && !isNaN(num) && isFinite(num)) return parseInt(serie)
                        })
                        let sumSeries

                        if (routineSeries && routineSeries.length) {
                          sumSeries = routineSeries.reduce(
                            (total, number) => total! + (number ? number : 0)
                          )
                        }
                        return (
                          <TableCell
                            key={`category-week-${e}`}
                            className="font-semibold text-black first:pl-5"
                          >
                            {sumSeries ? sumSeries : ''}
                          </TableCell>
                        )
                      }
                    )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
