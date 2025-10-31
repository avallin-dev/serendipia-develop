'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Slider from 'react-slick'

export default function SelectBoard({ boardList }: { boardList: { Nombre: string | null }[] }) {
  const params = useParams<{ id: string }>()
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
    <div className="slider-container w-[calc(100%_+_24px)]">
      <Slider {...settings}>
        {boardList.map((e, i) => (
          <Link key={'semana-' + i} href={(i + 1).toString()}>
            <div className="py-1 pr-3">
              <div
                className={`flex cursor-pointer items-center justify-center rounded-xl px-4 py-3 transition-colors ${
                  params?.id === (i + 1).toString()
                    ? 'pointer-events-none select-none bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-nowrap text-xs font-semibold sm:text-base">{e.Nombre}</p>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  )
}
