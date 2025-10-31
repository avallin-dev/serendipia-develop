'use client'

import Slider from 'react-slick'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SelectDay({ planDays }: { planDays?: number | null }) {
  const settings = {
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    className: 'slider variable-width',
    variableWidth: true,
    arrows: false,
    swipeToSlide: true,
  }

  return (
    <TabsList className="mt-0 h-auto w-full justify-start bg-transparent p-0">
      <div className="slider-container">
        <Slider {...settings}>
          {Array.from(Array(planDays)).map((e, i) => (
            <div key={'day-' + i} className="py-2 pr-4">
              <TabsTrigger
                value={'day' + i}
                className="cursor-pointer rounded-xl bg-secondary py-3 text-[#9F9F9F] data-[state=active]:bg-secondary-dark data-[state=active]:text-secondary-foreground"
                asChild
              >
                <p className="text-xs font-bold">Dia {i + 1}</p>
              </TabsTrigger>
            </div>
          ))}
        </Slider>
      </div>
    </TabsList>
  )
}
