'use client'

import Slider from 'react-slick'

import { useReadme } from '@/app/services/queries/readme'

import ReadmeCard from './readme-card'

export default function SliderReadme() {
  const { readme } = useReadme()

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
          variableWidth: true,
        },
      },
    ],
  }

  return (
    <div className="slider-container sm:-ml-3">
      <div className=" sm:w-[calc(100%_+_4rem)]">
        <Slider {...settings} className="overflow-hidden">
          {readme.map((readmeItem) => (
            <div key={'rutine' + readmeItem.id} style={{ width: 430 }}>
              <ReadmeCard
                comment={readmeItem.comment}
                title={readmeItem.title}
                videoLink={readmeItem.videoURL}
                file={readmeItem.file}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
