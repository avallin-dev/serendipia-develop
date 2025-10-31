'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { rutina_ejercicio_detalle } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Switch } from '@/app/components/ui/switch'
import { routineSchema, routineSchmaType } from '@/app/schemas/routine'
import { useCreateRoutine, useUpdateRoutine } from '@/app/services/mutations/routine'
import { useExercises } from '@/app/services/queries/exercise'
import { RoutineWithExerciseType } from '@/app/types/routine'
import { Combobox } from '@/components/Combobox'

type UpdateRoutineProps = {
  onClose: () => void
  open: boolean
  routine?: RoutineWithExerciseType
  semanas?: number | null
  selectedType: 'socio' | 'grupo' | 'bloque'
  isUpdate: boolean
  idPlan?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SeriesSemana({ control, semanaIdx }: { control: any; semanaIdx: number }) {
  const seriesFieldArray = useFieldArray({
    control,
    name: `detalles.${semanaIdx}.series`,
  })

  return (
    <>
      {seriesFieldArray.fields.map((serieField, serieIdx) => (
        <div key={serieField.id} className="grid grid-cols-2 items-end gap-4 md:grid-cols-4">
          <Controller
            control={control}
            name={`detalles.${semanaIdx}.series.${serieIdx}.serie`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serie</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={serieIdx + 1}
                    readOnly
                    className="rounded-full"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name={`detalles.${semanaIdx}.series.${serieIdx}.repeticiones`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeticiones</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="rounded-full"
                    required
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name={`detalles.${semanaIdx}.series.${serieIdx}.peso`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="rounded-full"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={control}
            name={`detalles.${semanaIdx}.series.${serieIdx}.descanso`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descanso</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="rounded-full"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => seriesFieldArray.remove(serieIdx)}
            className="col-start-4 mb-3 rounded-full border-destructive text-destructive"
            disabled={seriesFieldArray.fields.length === 1}
          >
            Eliminar
          </Button>
        </div>
      ))}
      <h3 className="col-span-3 flex w-full items-center">
        <span className="h-0.5 flex-grow rounded bg-gray-200"></span>
        <button
          className="text-md mx-3 rounded-full border px-6 py-0.5 font-medium hover:bg-gray-200"
          type="button"
          onClick={() =>
            seriesFieldArray.append({
              serie: seriesFieldArray.fields.length + 1,
              repeticiones: 0,
              descanso: 60,
              rpe: 'FIVE',
              peso: 0,
              comentario: '',
            })
          }
        >
          Añadir serie
        </button>
        <span className="h-0.5 flex-grow rounded bg-gray-200"></span>
      </h3>
    </>
  )
}

// Definir tipo para las series
interface RoutineSerie {
  serie: number
  repeticiones?: number | undefined
  descanso?: number | undefined
  rpe?: string | undefined
  peso?: number | undefined
  comentario?: string | undefined
}

// Agrupa los detalles planos por semana para el formulario
function agruparDetallesPorSemana(detalles: rutina_ejercicio_detalle[]) {
  const semanasMap = new Map<number, { semana: number; series: RoutineSerie[] }>()
  detalles.forEach((detalle) => {
    if (!semanasMap.has(detalle.semana)) {
      semanasMap.set(detalle.semana, { semana: detalle.semana, series: [] })
    }
    semanasMap.get(detalle.semana)!.series.push({
      serie: detalle.serie ?? undefined,
      repeticiones: detalle.repeticiones !== null ? detalle.repeticiones : undefined,
      descanso: detalle.descanso !== null ? detalle.descanso : undefined,
      rpe: detalle.rpe ?? undefined,
      peso: detalle.peso !== null ? detalle.peso : undefined,
      comentario: detalle.comentario ?? undefined,
    })
  })
  // Ordenar por semana
  return Array.from(semanasMap.values()).sort((a, b) => a.semana - b.semana)
}

export default function UpdateRoutine({
  onClose,
  open,
  routine,
  semanas,
  selectedType,
  isUpdate,
  idPlan,
}: UpdateRoutineProps) {
  const queryClient = useQueryClient()
  const updateExerciseMutation = useUpdateRoutine()
  const createExerciseMutation = useCreateRoutine()

  const { exercises } = useExercises()
  const exercisesData = exercises.map((e) => ({
    value: e.idEjercicio.toString(),
    label: e.nombreEj,
  }))

  const form = useForm<routineSchmaType>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      dia: routine?.dia ?? 0,
      nroEjercicio: routine?.nroEjercicio ?? '',
      repeticionS1: routine?.repeticionS1 ?? '',
      comentarioS1: routine?.comentarioS1 ?? '',
      repeticionS2: routine?.repeticionS2 ?? '',
      comentarioS2: routine?.comentarioS2 ?? '',
      repeticionS3: routine?.repeticionS3 ?? '',
      comentarioS3: routine?.comentarioS3 ?? '',
      repeticionS4: routine?.repeticionS4 ?? '',
      comentarioS4: routine?.comentarioS4 ?? '',
      repeticionS5: routine?.repeticionS5 ?? '',
      comentarioS5: routine?.comentarioS5 ?? '',
      repeticionS6: routine?.repeticionS6 ?? '',
      comentarioS6: routine?.comentarioS6 ?? '',
      repeticionS7: routine?.repeticionS7 ?? '',
      comentarioS7: routine?.comentarioS7 ?? '',
      repeticionS8: routine?.repeticionS8 ?? '',
      comentarioS8: routine?.comentarioS8 ?? '',
      repeticionS9: routine?.repeticionS9 ?? '',
      comentarioS9: routine?.comentarioS9 ?? '',
      repeticionS10: routine?.repeticionS10 ?? '',
      comentarioS10: routine?.comentarioS10 ?? '',
      repeticionS11: routine?.repeticionS11 ?? '',
      comentarioS11: routine?.comentarioS11 ?? '',
      repeticionS12: routine?.repeticionS12 ?? '',
      comentarioS12: routine?.comentarioS12 ?? '',
      idEjercicio: routine?.idEjercicio ? routine?.idEjercicio.toString() : '',
      idPlan: idPlan ? idPlan.toString() : '',
      has_details: routine?.has_details ?? false,
      detalles:
        routine?.detalles && routine?.detalles.length > 0
          ? agruparDetallesPorSemana(routine.detalles)
          : [],
    },
  })

  useEffect(() => {
    if (open) {
      if (isUpdate && routine) {
        form.reset({
          dia: routine.dia ?? 0,
          nroEjercicio: routine.nroEjercicio ?? '',
          repeticionS1: routine.repeticionS1 ?? '',
          comentarioS1: routine.comentarioS1 ?? '',
          repeticionS2: routine.repeticionS2 ?? '',
          comentarioS2: routine.comentarioS2 ?? '',
          repeticionS3: routine.repeticionS3 ?? '',
          comentarioS3: routine.comentarioS3 ?? '',
          repeticionS4: routine.repeticionS4 ?? '',
          comentarioS4: routine.comentarioS4 ?? '',
          repeticionS5: routine.repeticionS5 ?? '',
          comentarioS5: routine.comentarioS5 ?? '',
          repeticionS6: routine.repeticionS6 ?? '',
          comentarioS6: routine.comentarioS6 ?? '',
          repeticionS7: routine.repeticionS7 ?? '',
          comentarioS7: routine.comentarioS7 ?? '',
          repeticionS8: routine.repeticionS8 ?? '',
          comentarioS8: routine.comentarioS8 ?? '',
          repeticionS9: routine.repeticionS9 ?? '',
          comentarioS9: routine.comentarioS9 ?? '',
          repeticionS10: routine.repeticionS10 ?? '',
          comentarioS10: routine.comentarioS10 ?? '',
          repeticionS11: routine.repeticionS11 ?? '',
          comentarioS11: routine.comentarioS11 ?? '',
          repeticionS12: routine.repeticionS12 ?? '',
          comentarioS12: routine.comentarioS12 ?? '',
          idEjercicio: routine.idEjercicio ? routine.idEjercicio.toString() : '',
          idPlan: idPlan ? idPlan.toString() : '',
          has_details: routine.has_details ?? false,
          detalles:
            routine.detalles && routine.detalles.length > 0
              ? agruparDetallesPorSemana(routine.detalles)
              : [],
        })
      } else {
        form.reset({
          dia: 0,
          nroEjercicio: '',
          repeticionS1: '',
          comentarioS1: '',
          repeticionS2: '',
          comentarioS2: '',
          repeticionS3: '',
          comentarioS3: '',
          repeticionS4: '',
          comentarioS4: '',
          repeticionS5: '',
          comentarioS5: '',
          repeticionS6: '',
          comentarioS6: '',
          repeticionS7: '',
          comentarioS7: '',
          repeticionS8: '',
          comentarioS8: '',
          repeticionS9: '',
          comentarioS9: '',
          repeticionS10: '',
          comentarioS10: '',
          repeticionS11: '',
          comentarioS11: '',
          repeticionS12: '',
          comentarioS12: '',
          idEjercicio: '',
          idPlan: idPlan ? idPlan.toString() : '',
          has_details: false,
          detalles: [],
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isUpdate, routine, idPlan])

  const showDetails = form.watch('has_details')

  // useEffect para inicializar detalles con series por semana SOLO si están vacíos
  useEffect(() => {
    if (showDetails && semanas) {
      const currentDetalles = form.getValues('detalles')
      if (!currentDetalles || currentDetalles.length === 0) {
        const initialDetalles = Array.from({ length: semanas }, (_, i) => ({
          semana: i + 1,
          series: [
            {
              serie: 1,
              repeticiones: 0,
              descanso: 60,
              rpe: 'FIVE',
              peso: 0,
              comentario: '',
            },
          ],
        }))
        form.setValue('detalles', initialDetalles)
      }
    }
  }, [showDetails, semanas, form])

  const detallesFields = useFieldArray({
    control: form.control,
    name: 'detalles',
  })

  async function onSubmit(values: routineSchmaType) {
    const id = routine?.idRutina
    const idPlan = routine?.idPlan
    if (id && isUpdate) {
      updateExerciseMutation.mutate(
        { data: values, id: id! },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['routine', idPlan],
            })
            toast.success('Ejercicio actualizado exitosamente')
            onClose()
          },
          onError(error) {
            console.error(error)
            toast.error('Error inesperado. Intente mas tarde')
          },
        }
      )
    } else {
      createExerciseMutation.mutate(
        { data: values },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ['routine', idPlan],
            })
            toast.success('Ejercicio creado exitosamente')
            onClose()
          },
          onError(error) {
            toast.error(error.message ?? 'Error inesperado. Intente mas tarde')
          },
        }
      )
    }
  }

  type RepeticionKeys =
    | `repeticionS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
    | `comentarioS${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {selectedType === 'socio' && (
          <FormField
            control={form.control}
            name="has_details"
            render={({ field }) => (
              <FormItem className="mb-4 flex items-center gap-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-secondary"
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mostrar detalles
                </FormLabel>
              </FormItem>
            )}
          />
        )}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="dia"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Dia</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="hide_arrows rounded-full"
                  />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="mt-1 text-xs tracking-wide" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nroEjercicio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Nro de ejercicio</FormLabel>
                <FormControl>
                  <Input {...field} type="text" className="rounded-full" required />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="mt-1 text-xs tracking-wide" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idEjercicio"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="mt-[4px] text-sm font-medium leading-[19.2px]">
                  Selecciona ejercicio
                </div>
                <Combobox
                  data={exercisesData}
                  placeholder="ejercicios"
                  onChange={field.onChange}
                  value={field.value}
                  slice={20}
                />
                <div className="h-4">
                  <div className="h-4">
                    <FormMessage className="mt-1 text-xs tracking-wide" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          {showDetails && semanas ? (
            <div className="col-span-3">
              {detallesFields.fields.map((semanaField, semanaIdx) => (
                <div key={semanaField.id} className="mb-2 pb-4">
                  <FormLabel className="mb-4 block font-bold">Semana {semanaIdx + 1}</FormLabel>
                  <SeriesSemana control={form.control} semanaIdx={semanaIdx} />
                  <FormField
                    control={form.control}
                    name={`comentarioS${semanaIdx + 1}` as RepeticionKeys}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Comentario de la semana {semanaIdx + 1}</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="rounded-full" required />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage className="mt-1 text-xs tracking-wide" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          ) : (
            semanas &&
            Array.from({ length: semanas }, (_, i) => i + 1).map((e) => (
              <React.Fragment key={e}>
                <FormField
                  control={form.control}
                  name={`repeticionS${e}` as RepeticionKeys}
                  render={({ field }) => (
                    <FormItem className="col-start-1 space-y-2">
                      <FormLabel>Semana {e} Series-Rep</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="rounded-full" required />
                      </FormControl>
                      <div className="h-4">
                        <FormMessage className="mt-1 text-xs tracking-wide" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`comentarioS${e}` as RepeticionKeys}
                  render={({ field }) => (
                    <FormItem className="col-start-2 space-y-2">
                      <FormLabel>Comentario {e}</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="rounded-full" required />
                      </FormControl>
                      <div className="h-4">
                        <FormMessage className="mt-1 text-xs tracking-wide" />
                      </div>
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))
          )}
        </div>
      </form>
    </Form>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`${isUpdate ? 'Editar' : 'Crear'} ejercicio`}
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel={`${isUpdate ? 'Editar' : 'Crear'} ejercicio`}
      disabled={isUpdate ? updateExerciseMutation.isPending : createExerciseMutation.isPending}
      isLoading={isUpdate ? updateExerciseMutation.isPending : createExerciseMutation.isPending}
    />
  )
}
