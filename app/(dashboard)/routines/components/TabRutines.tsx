'use client'

import { LegacyRef, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

import TablesLoading from '@/app/components/TablesLoading'
import { useWeek } from '@/app/hooks/useWeek'
import { useRoutinesByPlanAndWeek } from '@/app/services/queries/routine'
import determineCodeType from '@/app/utils/determineCodeType'
import selectWeek from '@/app/utils/selectWeek'

import ModalRPE from './ModalRPE'
import RoutineCard from './RoutineCardComment'

export default function TabRoutines({ day, planId }: { day: number; planId: number }) {
  const { week, setCurrentDay } = useWeek()
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [routineDetalleId, setRoutineDetalleId] = useState<number | null>(null)
  const { routines, isLoading, isFetching } = useRoutinesByPlanAndWeek(planId, week)
  useEffect(() => {
    setCurrentDay(day)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  const sliderRef: LegacyRef<Slider> | undefined = useRef(null)
  const rutinasByDay = routines?.filter((e) => {
    return e.dia === day
  })

  const settings = {
    className: 'slider variable-width',
    infinite: false,
    slidesToShow: 1,
    swipeToSlide: true,
    variableWidth: true,
    arrows: false,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          variableWidth: false,
          slidesToShow: 1,
          className: '',
          infinite: true,
        },
      },
    ],
  }

  const onOpenFeedBackModal = (routineDetalleId: number) => {
    setRoutineDetalleId(routineDetalleId)
    setFeedbackModal(true)
  }

  if (sliderRef?.current) {
    sliderRef.current.slickGoTo(0)
  }

  if (isLoading || isFetching) {
    return <TablesLoading />
  }
  return (
    <div className="slider-container sm:-ml-3">
      <div className=" sm:w-[calc(100%_+_4rem)]">
        <Slider {...settings} className="overflow-hidden" ref={sliderRef}>
          {rutinasByDay?.map((rutina, index) => {
            const codeNro = determineCodeType(rutina.nroEjercicio)
            const codeBorderColor = {
              odd: 'outline-primary',
              even: 'outline-white',
              rare: 'outline-magenta',
            }
            const codeBgColor = {
              odd: 'bg-primary',
              even: 'bg-white',
              rare: 'bg-magenta',
            }
            return (
              <div key={'routine' + index + 'week' + week} style={{ width: 430 }}>
                <RoutineCard
                  comment={selectWeek(week, rutina)[1]}
                  exerciseName={rutina.ejercicios.nombreEj}
                  exerciseNo={rutina.nroEjercicio}
                  codeBorderColor={codeBorderColor[codeNro]}
                  codeBgColor={codeBgColor[codeNro]}
                  repetitions={selectWeek(week, rutina)[0]}
                  videoLink={rutina.ejercicios.linkEj}
                  routineId={rutina.idRutina}
                  routineComment={rutina.partner_comment}
                  hasDetails={rutina.has_details}
                  details={rutina.detalles?.filter((e) => e.semana === week)}
                  onOpenFeedBackModal={onOpenFeedBackModal}
                />
              </div>
            )
          })}
        </Slider>
      </div>

      <ModalRPE
        open={feedbackModal}
        onClose={() => setFeedbackModal(false)}
        routineDetalleId={routineDetalleId!}
      />
    </div>
  )
}
