'use client'

import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isBefore,
    isEqual,
    isSameMonth,
    isSaturday,
    isSunday,
    isToday,
    parse,
    startOfToday,
} from 'date-fns'
import {es} from 'date-fns/locale'
import {Fragment, useState} from 'react'
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri'

import TablesLoading from '@/app/components/TablesLoading'
import {useAuth} from '@/app/hooks/useAuth'
import {
    usePartnerMembershipWithPilates,
    usePilatesByPartner,
    usePilatesRecover,
} from '@/app/services/queries/pilate'

import {ClassCard, RecoveryCard} from './_components'

function classNames(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}

const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

export default function Page() {
    const {user} = useAuth()
    const id = user?.idSocio
    const {pilates, isLoading, isFetching} = usePilatesByPartner(id)
    const {pilatesRecover, isLoading: isLoadingPilatesRecover} = usePilatesRecover()
    const {partnerMembership, isLoading: isLoadingPartnerMembership} =
        usePartnerMembershipWithPilates(id)
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    // console.log(pilates)
    console.log(partnerMembership)

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: -1})
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: 1})
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    const selectedDayPilates =
        !isLoading &&
        pilates?.filter((pilate) => {
            const startDate = new Date(pilate.start)
            const hoy = new Date(selectedDay)

            return (
                startDate.getUTCMonth() === hoy.getUTCMonth() && startDate.getUTCDate() === hoy.getUTCDate()
            )
        })

    const daysFormat = [
        {label: 'Lunes', value: '1'},
        {label: 'Martes', value: '2'},
        {label: 'Miércoles', value: '3'},
        {label: 'Jueves', value: '4'},
        {label: 'Viernes', value: '5'},
        {label: 'Sábado', value: '6'},
        {label: 'Domingo', value: '0'},
    ]

    if (isLoading || isFetching || isLoadingPilatesRecover || isLoadingPartnerMembership) {
        return <TablesLoading/>
    }

    return (
        <div className="pb-2 lg:pb-0">
            {partnerMembership ? (
                <>
                    <h1 className="text-lg font-semibold lg:text-4xl">Tus clases</h1>
                    <div className="h-2"></div>
                    <div className="space-y-2 py-2">
                        {partnerMembership.map((item) => (
                            <h3 key={item.id}
                                className="text-base font-medium text-magenta lg:text-xl">
                                {daysFormat.find((e) => e.value === item.day)?.label} - {item.time}
                            </h3>
                        ))}
                    </div>
                </>
            ) : null}
            <div className="h-4"></div>
            <h2 className="text-lg font-semibold text-black">
                {isToday(selectedDay) ? 'Hoy' : 'Dia'}{' '}
                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {format(selectedDay, 'dd MMMM yyy', {
                        locale: es,
                    })}
                </time>
            </h2>
            <div className="h-4"></div>
            {pilatesRecover.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold text-primary-foreground">
                        Tienes clases que puedes recuperar
                    </h2>
                    <div className="h-1"></div>
                    <div className="rounded-lg border bg-gray-200 px-5 py-3">
                        <p className="text-pretty text-sm font-semibold">
                            La clase se puede recuperar dentro del mismo mes
                        </p>
                    </div>
                    <div className="h-3"></div>
                    {pilatesRecover?.map((pilateRecover, i) => (
                        <Fragment key={`day-${i}`}>
                            <RecoveryCard pilateRecover={pilateRecover} selectedDay={selectedDay}/>
                            <div className="h-3"></div>
                        </Fragment>
                    ))}
                </>
            )}
            <div
                className="flex w-full flex-col-reverse gap-2 overflow-x-auto lg:min-h-[calc(100vh-180px)] lg:flex-row">
                <div className="lg:w-2/3">
                    <section className="relative mt-8 rounded-lg md:mt-0">
                        <h2 className="font-semibold text-primary-foreground">Clases del dia</h2>
                        <div>
                            <ol className="mt-4 space-y-2 text-sm leading-6 text-gray-500">
                                {selectedDayPilates && selectedDayPilates?.length > 0 ? (
                                    selectedDayPilates?.map((pilateDay, i) => (
                                        <ClassCard key={`day-${i}`} pilateDay={pilateDay}/>
                                    ))
                                ) : (
                                    <p>No hay clases</p>
                                )}
                            </ol>
                        </div>
                    </section>
                </div>
                <div className="p-2 lg:w-1/3">
                    <div className="rounded-lg border-2 border-gray-400 bg-white p-4">
                        <div className="flex items-center">
                            <h2 className="flex-auto text-xl font-semibold text-primary-foreground">
                                {format(firstDayCurrentMonth, 'LLLL yyyy', {
                                    locale: es,
                                })}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <RiArrowLeftSLine className="h-5 w-5" aria-hidden="true"/>
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <RiArrowRightSLine className="h-5 w-5" aria-hidden="true"/>
                            </button>
                        </div>
                        <div
                            className="mt-10 grid grid-cols-7 text-center text-base font-medium leading-6 text-gray-600 sm:text-lg">
                            <div>Dom</div>
                            <div>Lun</div>
                            <div>Mar</div>
                            <div>Mié</div>
                            <div>Jue</div>
                            <div>Vie</div>
                            <div>Sab</div>
                        </div>
                        <div className="mt-2 grid grid-cols-7 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-1.5',
                                        isSunday(day) && 'pointer-events-none',
                                        isSaturday(day) && 'pointer-events-none'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',
                                            !isEqual(day, selectedDay) && isToday(day) && 'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            '',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            '',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                                            isBefore(day, today) && 'text-gray-400',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                            (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium',
                                            isSunday(day) && 'text-gray-600/25',
                                            isSaturday(day) && 'text-gray-600/25'
                                        )}
                                    >
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                    </button>

                                    <div className="mx-auto mt-1 h-1 w-1">
                                        {pilates?.some((member) => {
                                            const pilatesDay = new Date(member.start)
                                            const hoy = new Date(day)

                                            return (
                                                pilatesDay.getUTCMonth() === hoy.getUTCMonth() &&
                                                pilatesDay.getUTCDate() === hoy.getUTCDate()
                                            )
                                        }) && <div
                                            className="h-2 w-2 self-center rounded-full bg-sky-500"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


