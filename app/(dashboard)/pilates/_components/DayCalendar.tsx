'use client'
import {
  addDays,
  format,
  isAfter,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { toast } from 'sonner'

import ModalWrapper from '@/app/components/ModalWrapper'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CustomCalendar.css'
import useConfirm from '@/app/hooks/use-confirm'
import { usePilates } from '@/app/services/queries/pilate'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'

require('moment/locale/es.js')

interface DayCalendarProps {
  selectedDate: Date
  onSlotClick?: (date: { start: Date; end: Date }) => void
  onClose: () => void
  open: boolean
  recoveryClassCardDate: Date
}

export function DayCalendar({
  selectedDate,
  onSlotClick,
  onClose,
  open,
  recoveryClassCardDate,
}: DayCalendarProps) {
  const { pilates, isLoading, isFetching } = usePilates(
    startOfWeek(selectedDate, { weekStartsOn: 1 }),
    endOfWeek(selectedDate, { weekStartsOn: 1 })
  )
  const [events, setEvents] = useState<
    {
      start: Date
      end: Date
      title: string
    }[]
  >([])

  const [time, setTime] = useState<Date | null>(null)
  const [ConfirmationDialog, confirm] = useConfirm(
    'Si',
    `¿Quieres seleccionar las ${time && format(time, 'k a')}?`
  )
  const MAX_BEDS = 6
  const selectedDateFormatted = moment(selectedDate).format('YYYY-MM-DD')

  useEffect(() => {
    if (!isLoading && pilates) {
      const eventCountPerHour = {}
      const eventFreedCountPerHour = {}
      const freeSlotEvents: {
        start: Date
        end: Date
        title: string
        isFreeSlot: boolean
      }[] = []

      pilates.forEach((event) => {
        const eventDate = moment(formatTrulyUTC(event.start)).format('YYYY-MM-DD')

        if (eventDate === selectedDateFormatted) {
          const hour = new Date(formatTrulyUTC(event.start)).getHours()
          if (event.fap && event.fap === 'F') {
            eventFreedCountPerHour[hour] = (eventFreedCountPerHour[hour] || 0) + 1
          } else {
            eventCountPerHour[hour] = (eventCountPerHour[hour] || 0) + 1
          }
        }
      })

      for (let hour = 8; hour < 21; hour++) {
        if (hour === 12 || hour === 11 || hour === 13) continue

        const occupiedSlots = eventCountPerHour[hour] || 0
        const freedSlots = eventFreedCountPerHour[hour] || 0
        const start = moment(selectedDate).set({ hour, minute: 0, second: 0 }).toDate()
        const end = moment(start).add(1, 'hour').toDate()

        const dayAfterTomorrow = addDays(recoveryClassCardDate, 2)
        const isAfterDayAfterTomorrow = isAfter(start, dayAfterTomorrow)

        if (occupiedSlots === MAX_BEDS) {
          continue
        } else if (freedSlots > 0) {
          freeSlotEvents.push({
            title: 'Liberado',
            start: new Date(start),
            end: new Date(end),
            isFreeSlot: false,
          })
        } else if (!isAfterDayAfterTomorrow) {
          freeSlotEvents.push({
            title: 'Libre',
            start: new Date(start),
            end: new Date(end),
            isFreeSlot: true,
          })
        }
        // else {
        //   freeSlotEvents.push({
        //     title: 'Libre',
        //     start: new Date(start),
        //     end: new Date(end),
        //     isFreeSlot: true,
        //   })
        // }
      }
      setEvents(freeSlotEvents)
    }
    return () => {
      setEvents([])
      setTime(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  const handleSelectEvent = useCallback(
    async (calEvent) => {
      setTime(calEvent.start)
      const hour = calEvent.start.getHours()
      if (hour >= 11 && hour < 14) return
      const dayAfterTomorrow = addDays(recoveryClassCardDate, 2)
      const isAfterDayAfterTomorrow = isAfter(calEvent.start, dayAfterTomorrow)
      if (!isAfterDayAfterTomorrow) {
        if (calEvent.isFreeSlot || calEvent.title === 'Liberado') {
          const ok = await confirm()
          if (ok) {
            onSlotClick?.(calEvent)
          }
        }
      } else {
        if (calEvent.title === 'Liberado') {
          const ok = await confirm()
          if (ok) {
            onSlotClick?.(calEvent)
          }
        } else {
          toast.error('Solo puede usar espacios Liberados')
          return
        }
      }
    },
    [confirm, onSlotClick, recoveryClassCardDate]
  )

  const eventPropGetter = (event, _start, _end, _isSelected) => {
    return {
      style: {
        ...(event.isFreeSlot ? { backgroundColor: '#28dfa3' } : { backgroundColor: '#03bb85' }),
      },
      start: new Date(event.start + 'Z'),
      end: new Date(event.end + 'Z'),
    }
  }

  const minTime = setMinutes(setHours(startOfDay(new Date()), 8), 0)
  const maxTime = setMinutes(setHours(startOfDay(new Date()), 21), 0)
  const bodyContent = (
    <div>
      <ConfirmationDialog />
      <Calendar
        localizer={momentLocalizer(moment)}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="day"
        min={minTime}
        max={maxTime}
        views={['day']}
        date={selectedDate}
        style={{ height: '85vh' }}
        toolbar={false}
        selectable={true}
        onSelectSlot={() => null}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        timeslots={1}
        step={60}
        className="day-calendar"
      />
    </div>
  )

  return (
    <ModalWrapper
      isOpen={open}
      onClose={onClose}
      title="Elegir hora de la clase"
      body={bodyContent}
      hideFooter
    />
  )
}
