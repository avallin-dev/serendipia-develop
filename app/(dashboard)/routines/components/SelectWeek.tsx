'use client'

import type { plan } from '@prisma/client'
import { add, isValid, format } from 'date-fns'
import { es } from 'date-fns/locale'
import Slider from 'react-slick'

import { useWeek } from '@/app/hooks/useWeek'

export default function SelectWeek({ plan }: { plan?: plan | null }) {
  const { week, setWeek } = useWeek()
  let mutableDate = plan?.fechaCreacion

  const selectWeek = (days: number, fecha?: Date | null) => {
    if (isValid(fecha)) {
      const plusDays = add(fecha!, { days: days })
      mutableDate = plusDays
      const result = format(plusDays, 'dd-MMM', { locale: es })
      return result
    }
  }

  const settings = {
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    className: 'slider variable-width',
    variableWidth: true,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          autoplay: true,
          speed: 1000,
          cssEase: 'linear',
          infinite: true,
        },
      },
    ],
  }

  return (
    <div className="slider-container">
      <div className="w-[calc(100%_+_4rem)]">
        <Slider {...settings}>
          {Array.from(Array.from({ length: plan?.semanas || 1 }, (_, i) => i + 1)).map((e, i) => (
            <div key={'semana-' + i} className="py-2 pr-4">
              <div
                className={`cursor-pointer rounded-xl p-4 ${
                  e === week
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setWeek(e)}
              >
                <p className="text-xs font-bold">
                  Semana {e} | {selectWeek(e === 1 ? 0 : 1, mutableDate)} al{' '}
                  {selectWeek(6, mutableDate)}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
