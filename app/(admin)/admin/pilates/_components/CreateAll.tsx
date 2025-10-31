'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { pilates } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState, useMemo, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Combobox } from '@/app/components/Combobox'
import ModalWrapper from '@/app/components/ModalWrapper'
import { Button } from '@/app/components/ui/button'
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from '@/app/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { Tabs, TabsContent } from '@/app/components/ui/tabs'
import useConfirm from '@/app/hooks/use-confirm'
import { pilateFullSchmaType2, pilateFullSchema2, pilateFullSchmaType } from '@/app/schemas/pilate'
import { useCreateAllPilate } from '@/app/services/mutations/pilate'
import { usePartnerWithPilates } from '@/app/services/queries/partner'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'

type CreateProps = {
  onClose: () => void
  open: boolean
}

export default function Create({ onClose, open }: CreateProps) {
  const [classesByMembership, setClassesByMembership] = useState<number>(0)
  const [selectedPartnerMembership, setSelectedPartnerMembership] = useState<string | undefined>()
  const [defaultClasses, setDefaultClasses] = useState<{ day: string; time: string }[]>([])
  const [pilates, setPilates] = useState<pilates[]>([])
  const [activeTab, setActiveTab] = useState('form')
  const [selectedPartnerMembershipTerm, setSelectedPartnerMembershipTerm] = useState<
    string | undefined
  >()
  const [ConfirmationDialog, confirm] = useConfirm(
    'Si',
    `Has modificado las clases establecidas. ¿Quieres continuar con estos cambios?`
  )
  const queryClient = useQueryClient()
  const createPilateMutation = useCreateAllPilate()
  const form = useForm<pilateFullSchmaType2>({
    resolver: zodResolver(pilateFullSchema2),
    defaultValues: {
      idSocio: '',
      sociomembresiaPilates: [],
    },
  })
  const { partners } = usePartnerWithPilates()
  const partnerData = useMemo(
    () =>
      partners.map((e) => ({
        value: e.idSocio.toString(),
        label: `${e.Nombre} ${e.Paterno} ${e.DNI ? '- ' + e.DNI : ''} `,
        membershipTitle: e.sociomembresia[0].membresia.Nombre,
        membershipTerm: `Desde el ${format(
          e.sociomembresia[0].fechaInicioMembresia!,
          "d 'de' MMM 'de' yyyy",
          { locale: es }
        )} hasta el ${format(e.sociomembresia[0].Vencimiento!, "d 'de' MMM 'de' yyyy", {
          locale: es,
        })}`,
        numero_de_clases: e.sociomembresia[0].numero_de_clases,
        existingClasses: e.sociomembresia[0].sociomembresiaPilates.map((c) => ({
          day: c.day.toString(),
          time: c.time,
        })),
        pilates: e.pilates,
      })),
    [partners]
  )

  const days = useMemo(
    () => [
      { label: 'Lunes', value: '1' },
      { label: 'Martes', value: '2' },
      { label: 'Miércoles', value: '3' },
      { label: 'Jueves', value: '4' },
      { label: 'Viernes', value: '5' },
      { label: 'Sábado', value: '6' },
    ],
    []
  )

  function generarHoras() {
    const horas: { label: string; value: string }[] = []
    const horaInicio = 6
    const horaFin = 22

    for (let hora = horaInicio; hora <= horaFin; hora++) {
      if ((hora >= 8 && hora <= 10) || (hora >= 14 && hora <= 20)) {
        const value = `${hora.toString().padStart(2, '0')}:00`
        horas.push({ label: value, value })
      }
    }
    return horas
  }

  const opcionesHoras = useMemo(() => generarHoras(), [])

  const handleOnChangePartner = useCallback(
    ({ event, field }) => {
      const findPartner = partnerData.find((e) => e.value === event)
      const membershipTitle = findPartner?.membershipTitle
      setClassesByMembership(findPartner?.numero_de_clases ?? 0)
      setSelectedPartnerMembership(membershipTitle!)
      setDefaultClasses(findPartner?.existingClasses ?? [])
      form.setValue('idSocio', event.toString())
      if (findPartner?.numero_de_clases) {
        const existing = findPartner?.existingClasses ?? []
        const clases = [
          ...existing,
          ...Array.from({ length: findPartner.numero_de_clases - existing.length }, () => ({
            day: '',
            time: '',
          })),
        ]
        form.setValue('sociomembresiaPilates', clases)
      }

      setPilates(findPartner?.pilates ?? [])
      setSelectedPartnerMembershipTerm(findPartner?.membershipTerm)
      field.onChange(event)
    },
    [partnerData, form]
  )

  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  async function onSubmit(values: pilateFullSchmaType2) {
    const selectedClasses = values.sociomembresiaPilates.filter(
      ({ day, time }) => day && time
    ).length

    if (selectedClasses > classesByMembership) {
      alert(`Solo puedes seleccionar hasta ${classesByMembership} clases.`)
      return
    }

    const currentClasses = form.watch('sociomembresiaPilates')

    const hasChanges = JSON.stringify(currentClasses) !== JSON.stringify(defaultClasses)
    if (hasChanges) {
      const ok = await confirm()
      if (!ok) return
    }
    const formattedData: Record<string, string> = {
      idSocio: values.idSocio,
    }

    for (let i = 0; i < 5; i++) {
      const classData = values.sociomembresiaPilates[i] || { day: '', time: '' }
      formattedData[`class${i + 1}Day`] = classData.day || ''
      formattedData[`class${i + 1}Time`] = classData.time || ''
    }
    createPilateMutation.mutate(
      { data: formattedData as pilateFullSchmaType },
      {
        onSuccess(messages) {
          queryClient.invalidateQueries({
            queryKey: ['pilate'],
          })
          if (messages) messages.forEach((message) => toast.success(message))
          else toast.success('Clase creada con éxito')
          onClose()
        },
        onError(error) {
          console.error(error)
          toast.error('Error inesperado. Intente más tarde')
        },
      }
    )
  }

  const bodyContent = (
    <>
      <ConfirmationDialog />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="form">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idSocio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Selecciona socio</FormLabel>
                      <Combobox
                        data={partnerData}
                        placeholder="Socios"
                        onChange={(event) => handleOnChangePartner({ event, field })}
                        value={field.value!}
                      />
                      <div className="h-4">
                        <div className="h-4">
                          <FormMessage className="mt-1 text-xs tracking-wide" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                {pilates.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-2 self-center bg-gray-300"
                    onClick={() => setActiveTab('classes')}
                  >
                    Ver clases
                  </Button>
                )}
                {Array.from(
                  { length: form.getValues().sociomembresiaPilates.length },
                  (_, i) => i
                ).map((index) => {
                  const selectedClasses = form
                    .getValues()
                    .sociomembresiaPilates.filter(({ day, time }) => day && time).length

                  const disableDelete = selectedClasses <= classesByMembership

                  return (
                    <div
                      key={index}
                      className="col-span-full grid grid-cols-[1fr_1fr_auto] items-center gap-4"
                    >
                      <Controller
                        name={`sociomembresiaPilates.${index}.day`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Clase {index + 1} día</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-full">
                                  <SelectValue placeholder="Selecciona día" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent ref={field.ref}>
                                {days.map((day) => {
                                  const isDisabled = form
                                    .getValues()
                                    .sociomembresiaPilates?.some((c) => c.day === day.value)
                                  return (
                                    <SelectItem
                                      key={`day-${day.value}`}
                                      value={day.value}
                                      className="cursor-pointer"
                                      disabled={isDisabled}
                                    >
                                      {day.label}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <div className="h-4">
                              <FormMessage className="mt-1 text-xs tracking-wide" />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Controller
                        name={`sociomembresiaPilates.${index}.time`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Clase {index + 1} hora</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-full">
                                  <SelectValue placeholder="Selecciona hora" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent ref={field.ref}>
                                {opcionesHoras.map((time) => (
                                  <SelectItem
                                    key={`time-${time.value}`}
                                    value={time.value}
                                    className="cursor-pointer"
                                  >
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="h-4">
                              <FormMessage className="mt-1 text-xs tracking-wide" />
                            </div>
                          </FormItem>
                        )}
                      />
                      {selectedClasses > classesByMembership && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="ml-2"
                          disabled={disableDelete || deletingIndex === index}
                          onClick={() => {
                            setDeletingIndex(index)
                            const current = form.getValues().sociomembresiaPilates
                            form.setValue(
                              'sociomembresiaPilates',
                              current.filter((_, idx) => idx !== index)
                            )
                            setTimeout(() => setDeletingIndex(null), 300)
                          }}
                        >
                          <span className="sr-only">Eliminar</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="classes">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Resumen de la semana</h3>
            <Button variant="secondary" onClick={() => setActiveTab('form')}>
              Volver
            </Button>
          </div>
          <div className="shadow-md">
            <Table>
              <TableHeader className="bg-alto-200">
                <TableRow>
                  <TableHead className="rounded-tl-lg pl-10 font-bold text-chicago-600">
                    Dia
                  </TableHead>
                  <TableHead className="text-center font-bold text-chicago-600">Hora</TableHead>
                  <TableHead className="rounded-tr-lg pr-10 text-center font-bold text-chicago-600">
                    Estado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pilates.length > 0
                  ? pilates.map((p) => (
                      <TableRow key={'pilates-' + p.id}>
                        <TableCell className="pl-10 text-chicago-600 first-letter:uppercase">
                          <div className="flex gap-2">
                            <div className="first-letter:uppercase">
                              {format(p.start, 'iiii', { locale: es })}
                            </div>
                            <div>{format(p.start, 'MM-dd')}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {format(formatTrulyUTC(p.start), 'h aa')}
                        </TableCell>
                        <TableCell className="text-center">
                          {p.fap === 'A'
                            ? 'Ausente'
                            : p.fap === 'F'
                            ? 'Falta'
                            : p.fap === 'P'
                            ? 'Presente'
                            : ''}
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title={`Crear clase para socio ${
        selectedPartnerMembership !== undefined ? 'con Plan ' + selectedPartnerMembership : ''
      }`}
      description={selectedPartnerMembershipTerm !== undefined ? selectedPartnerMembershipTerm : ''}
      body={bodyContent}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Crear"
      disabled={activeTab === 'classes' || createPilateMutation.isPending}
      isLoading={createPilateMutation.isPending}
    />
  )
}
