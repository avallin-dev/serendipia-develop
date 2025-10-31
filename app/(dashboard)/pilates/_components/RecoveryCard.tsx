'use client'

import { $Enums } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { isBefore, startOfDay } from 'date-fns'
import { Fragment, useState } from 'react'
import { toast } from 'sonner'

import { useCreatePilateAndSaveRecovered } from '@/app/services/mutations/pilate'

import { DayCalendar } from './DayCalendar'

interface RecoveryCardProps {
  pilateRecover: {
    id: number
    idSocio: number | null
    idPilates: number
    createdAt: Date
    updatedAt: Date
    idPilatesRecovered: number | null
    pilates: {
      id: number
      idSocio: number | null
      createdAt: Date
      updatedAt: Date
      start: Date
      end: Date
      bed: number
      color: $Enums.pilates_color
      fap: $Enums.fap | null
    }
  }
  selectedDay: Date
}
export function RecoveryCard({ pilateRecover, selectedDay }: RecoveryCardProps) {
  const [dayCalendarIsOpen, setDayCalendarIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const createPilateMutation = useCreatePilateAndSaveRecovered()

  const handleSlotClick = ({ start, end }: { start: Date; end: Date }) => {
    const utcStart = new Date(
      Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        start.getHours(),
        start.getMinutes()
      )
    )

    const utcEnd = new Date(
      Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes())
    )
    const id = pilateRecover.idSocio?.toString()
    createPilateMutation.mutate(
      {
        data: { start: utcStart, end: utcEnd, idSocio: id!, classType: 'recuperativa' },
        idPilates: pilateRecover.idPilates,
      },
      {
        onSuccess({ message }) {
          queryClient.invalidateQueries({
            queryKey: ['pilate-recover'],
          })
          queryClient.invalidateQueries({
            queryKey: ['pilate-partner'],
          })
          toast.success(message)
          setDayCalendarIsOpen(false)
        },
        onError(error) {
          toast.error(error.message)
        },
      }
    )
  }

  const handleClick = () => {
    const startOfSelectedDay = startOfDay(selectedDay)
    const startOfPilatesDay = startOfDay(pilateRecover.pilates.start)
    const today = startOfDay(new Date())

    if (isBefore(startOfSelectedDay, today)) {
      console.warn('La fecha del Pilates no puede ser en el pasado.')
      return
    }

    if (isBefore(startOfSelectedDay, startOfPilatesDay)) {
      console.warn('La fecha del Pilates no puede ser en el pasado.')
      return
    }

    setDayCalendarIsOpen(true)
  }

  const getButtonClass = () => {
    const startOfSelectedDay = startOfDay(selectedDay)
    const startOfPilatesDay = startOfDay(pilateRecover.pilates.start)
    const today = startOfDay(new Date())

    if (isBefore(startOfSelectedDay, today)) {
      return 'bg-[#6A6A6A] text-white pointer-events-none'
    }

    if (isBefore(startOfSelectedDay, startOfPilatesDay)) {
      return 'bg-[#6A6A6A] text-white pointer-events-none'
    }

    return 'bg-green-200 cursor-pointer'
  }

  return (
    <Fragment>
      {dayCalendarIsOpen && (
        <DayCalendar
          selectedDate={selectedDay}
          open={dayCalendarIsOpen}
          onClose={() => setDayCalendarIsOpen(false)}
          onSlotClick={handleSlotClick}
          recoveryClassCardDate={pilateRecover.pilates.start}
        />
      )}
      <div
        className={`flex w-full items-center justify-between rounded-lg border-2 bg-opacity-80 p-3 transition-all duration-200 ease-in-out hover:bg-opacity-90 focus:ring focus:ring-primary-dark focus:ring-opacity-90 active:bg-opacity-90 ${getButtonClass()}`}
        onClick={() => handleClick()}
      >
        <div className="flex flex-col">
          <div className="font-medium">Recuperar clase</div>
          <div className="text-sm">
            {new Date(pilateRecover?.pilates.start).toLocaleDateString('es', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
