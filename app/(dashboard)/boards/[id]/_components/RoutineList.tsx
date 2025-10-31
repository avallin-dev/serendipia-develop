'use client'

import { Suspense, useEffect, useState } from 'react'
import Slider from 'react-slick'

import RoutineCard from '@/app/(dashboard)/_components/routine-card'
import { useMediaQuery } from '@/app/hooks/useMediaQuery'
import determineCodeType from '@/app/utils/determineCodeType'

import RoutineCardComponent from './routine-card'

type SliderBoardProps = {
  boards: {
    repeticionS1: string | null
    comentarioS1: string | null
    ejercicios: {
      nombreEj: string | null
      linkEj: string | null
      categoria_ej: {
        nombreCat: string | null
      }
    }
    plan: {
      NombrePlan: string
      idSocio: number | null
    }
    nroEjercicio: string
  }[]
  plan: string
}

function SliderBoard({ boards, plan }: SliderBoardProps) {
  const [mounted, setMounted] = useState(false)
  const mediaXl = useMediaQuery('(min-width: 1280px)')

  useEffect(() => {
    setMounted(true)
  }, [])

  function filterByNombrePlan(nombrePlan: string) {
    return boards.filter((item) => item.plan.NombrePlan === nombrePlan)
  }

  const settings = {
    className: 'slider variable-width',
    infinite: false,
    slidesToShow: 1,
    swipeToSlide: true,
    variableWidth: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          variableWidth: false,
        },
      },
    ],
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="rounded-lg outline-secondary 2xl:p-3 2xl:outline">
      <h2 className="mb-4 inline-block rounded-full bg-primary px-5 py-1 text-2xl font-medium text-secondary-dark shadow-md sm:text-xl">
        {plan}
      </h2>
      {mediaXl ? (
        <div className="grid grid-cols-4 grid-rows-1 gap-3 2xl:grid-cols-2">
          {filterByNombrePlan(plan).map((rutina, index) => {
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
              <div key={'value' + index} className="w-full">
                <RoutineCardComponent
                  comment={rutina.comentarioS1}
                  exerciseName={rutina.ejercicios.nombreEj}
                  exerciseNo={rutina.nroEjercicio}
                  codeBorderColor={codeBorderColor[codeNro]}
                  codeBgColor={codeBgColor[codeNro]}
                  repetitions={rutina.repeticionS1}
                  videoLink={rutina.ejercicios.linkEj}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="slider-container sm:-ml-3">
          <div className="sm:w-[calc(100%_+_4rem)]">
            <Slider {...settings} className="overflow-hidden">
              {filterByNombrePlan(plan).map((rutina, index) => {
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
                  <div key={'value' + index} style={{ width: 430 }}>
                    <RoutineCard
                      comment={rutina.comentarioS1}
                      exerciseName={rutina.ejercicios.nombreEj}
                      exerciseNo={rutina.nroEjercicio}
                      codeBorderColor={codeBorderColor[codeNro]}
                      codeBgColor={codeBgColor[codeNro]}
                      repetitions={rutina.repeticionS1}
                      videoLink={rutina.ejercicios.linkEj}
                    />
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Component({ boards, plan }: SliderBoardProps) {
  return (
    <Suspense>
      <SliderBoard boards={boards} plan={plan} />
    </Suspense>
  )
}
