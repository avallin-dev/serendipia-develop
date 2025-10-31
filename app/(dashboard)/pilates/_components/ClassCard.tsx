'use client'

import { $Enums } from '@prisma/client'
import { format } from 'date-fns'
import { Fragment, useState } from 'react'

import formatTrulyUTC from '@/app/utils/formatTrulyUTC'

import { SendFeed } from './SendFeed'

interface ClassCardProps {
  pilateDay: {
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
export function ClassCard({ pilateDay }: ClassCardProps) {
  const [sendFeedIsOpen, setSendFeedIsOpen] = useState(false)
  const backgroundColor = (fap) => {
    switch (fap) {
      case 'F':
        return 'bg-blue-500 bg-opacity-30'
      case 'A':
        return 'bg-red-600 bg-opacity-30'
      case 'P':
        return 'bg-green-500 bg-opacity-30'
      default:
        return 'bg-yellow-300'
    }
  }

  const handleOnClick = () => {
    if (!pilateDay?.fap) setSendFeedIsOpen(true)
  }

  return (
    <Fragment>
      {sendFeedIsOpen && (
        <SendFeed
          event={pilateDay}
          open={sendFeedIsOpen}
          onClose={() => setSendFeedIsOpen(false)}
        />
      )}
      <div
        className={`flex w-full items-center justify-between rounded-lg px-3 py-5 transition-all duration-200 ease-in-out hover:bg-opacity-20 focus:ring focus:ring-opacity-50 active:bg-opacity-30 ${backgroundColor(
          pilateDay.fap
        )}`}
        onClick={() => handleOnClick()}
      >
        <div className="flex flex-col">
          <h1 className="text-lg text-primary-foreground">
            {pilateDay.start.toLocaleDateString('es', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <h1>
            {format(formatTrulyUTC(pilateDay.start), 'h aa')} -{' '}
            {format(formatTrulyUTC(pilateDay.end), 'h aa')}
          </h1>
        </div>
      </div>
    </Fragment>
  )
}
