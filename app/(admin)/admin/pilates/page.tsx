'use client'

import { endOfWeek, setHours, setMinutes, startOfDay, startOfWeek } from 'date-fns'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
require('moment/locale/es.js')
import './CustomCalendar.css'
import { toast } from 'sonner'

import { Button } from '@/app/components/ui/button'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import { usePilates } from '@/app/services/queries/pilate'
import formatTrulyUTC from '@/app/utils/formatTrulyUTC'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import ChangeStatus from './_components/ChangeStatus'
import Create from './_components/Create'
import CreateAll from './_components/CreateAll'

const localizer = momentLocalizer(moment)

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([])
  const [visibleRange, setVisibleRange] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  })
  const [availableViewState, setAvailableViewState] = useState(false)
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [createAllIsOpen, setCreateAllIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [selected, setSelected] = useState()
  const [selectedSlot, setSelectedSlot] = useState<{ start?: Date; end?: Date }>({
    start: undefined,
    end: undefined,
  })
  const mediaQuerySM = useMediaQuery('(min-width: 768px)')

  const { pilates, isLoading, isFetching } = usePilates(visibleRange.start, visibleRange.end)
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if (!isLoading && pilates) {
      const eventsInUTC = pilates.map((event) => {
        return {
          ...event,
          start: formatTrulyUTC(event.start),
          end: formatTrulyUTC(event.end),
        }
      })
      setEvents(eventsInUTC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching])

  useEffect(() => {
    setView(mediaQuerySM ? 'week' : 'day')
  }, [mediaQuerySM])

  const handleSelectSlot = ({ start, end }) => {
    if (view !== 'month') {
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

      const hour = start.getHours()
      const selectedDate = moment(start).format('YYYY-MM-DD')
      const eventsInHour = events
        .filter((event) => {
          const eventDate = moment(event.start).format('YYYY-MM-DD')
          const eventHour = new Date(event.start).getHours()
          return eventDate === selectedDate && eventHour === hour
        })
        .filter((event) => {
          return event.fap !== 'F'
        })
      if (eventsInHour.length >= 6) {
        toast.info('Todos los espacios ocupados')
        return
      }
      if (hour >= 11 && hour < 14) return
      setSelectedSlot({ start: utcStart, end: utcEnd })
      setCreateIsOpen(true)
    } else {
      setView('week')
    }
  }

  const handleSelectEvent = useCallback(
    (calEvent) => {
      setSelected(calEvent)
      if (availableViewState) {
        setSelectedSlot({
          start: formatTrulyUTC(calEvent?.start),
          end: formatTrulyUTC(calEvent?.end),
        })
        setCreateIsOpen(true)
      } else {
        setUpdateIsOpen(true)
      }
    },
    [availableViewState]
  )

  const switchAvailableNormal = () => {
    setAvailableViewState((bool) => !bool)
  }

  const MAX_BEDS = 6
  const getFreeSlotEvents = () => {
    const eventCountPerDayHour = {}
    const freeSlotEvents: {
      id: number
      start: Date
      end: Date
      title: string
      bed: number
      isFreeSlot: boolean
    }[] = []

    events.forEach((event) => {
      if (event.fap === 'F') return
      const eventDate = moment(event.start).format('YYYY-MM-DD')
      const hour = new Date(event.start).getHours()

      eventCountPerDayHour[eventDate] = eventCountPerDayHour[eventDate] || {}
      eventCountPerDayHour[eventDate][hour] = (eventCountPerDayHour[eventDate][hour] || 0) + 1
    })

    const startDate = moment(visibleRange.start)
    const endDate = moment(visibleRange.end)

    for (let day = startDate.clone(); day.isBefore(endDate); day.add(1, 'days')) {
      const dayString = day.format('YYYY-MM-DD')

      for (let hour = 8; hour < 21; hour++) {
        if (hour === 12 || hour === 13 || hour === 11) continue

        const occupiedSlots = eventCountPerDayHour[dayString]?.[hour] || 0

        for (let i = 0; i < MAX_BEDS; i++) {
          const start = day.clone().set({ hour, minute: 0, second: 0 }).toDate()
          const end = moment(start).add(60, 'minutes').toDate()
          if (occupiedSlots < i + 1) {
            freeSlotEvents.push({
              id: parseInt(
                `${day.format('YYYYMMDD')}${hour.toString().padStart(2, '0')}${(i + 1)
                  .toString()
                  .padStart(2, '0')}`
              ),
              title: 'Espacio libre',
              start,
              end,
              bed: i + 1,
              isFreeSlot: true,
            })
          } else {
            freeSlotEvents.push({
              id: parseInt(
                `${day.format('YYYYMMDD')}${hour.toString().padStart(2, '0')}${(i + 1)
                  .toString()
                  .padStart(2, '0')}`
              ),
              title: 'Espacio ocupado',
              start,
              end,
              bed: i + 1,
              isFreeSlot: false,
            })
          }
        }
      }
    }

    return freeSlotEvents
  }

  const eventPropGetter = (event, _start, _end, _isSelected) => {
    const hour = new Date(event.start).getHours()
    const date = moment(event.start).format('YYYY-MM-DD')

    const eventsInSameHour = (availableViewState ? getFreeSlotEvents() : events).filter((e) => {
      const eventHour = new Date(e.start).getHours()
      const eventDate = moment(e.start).format('YYYY-MM-DD')
      return eventHour === hour && eventDate === date
    })

    const eventIndex = eventsInSameHour.findIndex((e) => e.id === event.id)
    const totalEvents = eventsInSameHour.length

    const heightPerEvent = 235 / Math.max(totalEvents, 6)
    const offset = eventIndex * heightPerEvent

    return {
      style: {
        ...(event.isFreeSlot ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }),
        ...(event.color && { backgroundColor: event.color.toLowerCase() }),
        left: '0%',
        marginTop: `${offset}px`,
        width: '100% !important',
        maxHeight: `${heightPerEvent - 2}px`,
        color: event.color === 'WHITE' ? 'black' : 'white',
      },
      start: new Date(event.start + 'Z'),
      end: new Date(event.end + 'Z'),
    }
  }

  const CustomEvent = ({ event }) => {
    return (
      <div className="flex h-full items-center justify-between gap-1 pl-1">
        <strong className="truncate">{event.title}</strong>
        {event?.fap && (
          <div className="flex h-full items-center bg-white px-2 text-primary-foreground">
            {event.fap}
          </div>
        )}
      </div>
    )
  }

  const customComponents = {
    event: CustomEvent,
  }
  const minTime = setMinutes(setHours(startOfDay(new Date()), 8), 0)
  const maxTime = setMinutes(setHours(startOfDay(new Date()), 21), 0)
  return (
    <div>
      <Dialog>
        {createIsOpen && (
          <Create
            open={createIsOpen}
            onClose={() => setCreateIsOpen(false)}
            selectedSlot={selectedSlot}
          />
        )}
        {updateIsOpen && (
          <ChangeStatus
            open={updateIsOpen}
            onClose={() => setUpdateIsOpen(false)}
            selected={selected}
          />
        )}
        {createAllIsOpen && (
          <CreateAll open={createAllIsOpen} onClose={() => setCreateAllIsOpen(false)} />
        )}
      </Dialog>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-center text-4xl font-semibold lg:text-left">Pilates</h1>
        <div className="flex justify-center gap-x-2 lg:justify-start">
          <Button
            className="border border-input p-6"
            variant={`${availableViewState ? 'secondary' : 'outline'}`}
            type="button"
            onClick={() => {
              switchAvailableNormal()
            }}
          >
            Camas libres
          </Button>
          <Button
            className="p-6"
            type="button"
            onClick={() => {
              setCreateAllIsOpen(true)
            }}
          >
            Crear Clase
          </Button>
        </div>
      </div>
      <div className="h-5 lg:h-10"></div>
      <Calendar
        localizer={localizer}
        events={availableViewState ? getFreeSlotEvents() : events}
        defaultDate={new Date()}
        view={view}
        onView={(newView: View) => setView(newView)}
        selectable
        step={60}
        timeslots={1}
        onSelectSlot={handleSelectSlot}
        min={minTime}
        max={maxTime}
        views={['month', 'week', 'day']}
        defaultView={view}
        date={date}
        onNavigate={(newDate, view) => {
          setDate(new Date(newDate))
          const start = moment(newDate)
            .startOf(view === 'month' ? 'month' : 'week')
            .toDate()
          const end = moment(newDate)
            .endOf(view === 'month' ? 'month' : 'week')
            .toDate()
          setVisibleRange({ start, end })
        }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        components={customComponents}
        messages={{
          today: 'Hoy',
          previous: 'Atrás',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
        }}
        className={cn('pilates-calendar', isFetching && 'blur-sm')}
      />
    </div>
  )
}
