'use client'

import Slider from 'react-slick'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SelectBoard({ boardList }: { boardList: { Nombre: string | null }[] }) {
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
    <TabsList className="h-auto w-full justify-start bg-transparent p-0">
      <div className="slider-container w-full">
        <div className="w-[calc(100%_+_4rem)]">
          <Slider {...settings}>
            {boardList.map((e, i) => (
              <div key={'semana-' + i} className="pr-4">
                <TabsTrigger
                  key={'board-' + i}
                  value={'board' + i}
                  className="flex cursor-pointer items-center justify-center rounded-xl bg-secondary p-4 text-white transition-colors data-[state=active]:bg-primary data-[state=active]:text-secondary-dark"
                  asChild
                >
                  <p className="text-nowrap text-xs font-bold sm:text-base">{e.Nombre}</p>
                </TabsTrigger>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </TabsList>
  )
}
