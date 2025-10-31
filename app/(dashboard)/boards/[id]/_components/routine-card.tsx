import { YouTubeEmbed } from '@next/third-parties/google'

import Timer from '@/app/components/Timer'
import formatSerie from '@/app/utils/formatSerie'

type RoutineCardProps = {
  codeBorderColor: string
  codeBgColor: string
  exerciseNo: string
  exerciseName: string | null
  repetitions?: string | null
  videoLink: string | null
  comment?: string | null
}

export default function RoutineCard({
  codeBorderColor,
  codeBgColor,
  exerciseNo,
  exerciseName,
  repetitions,
  videoLink,
  comment,
}: RoutineCardProps) {
  const { series, exerciseTime: seconds, restTime } = formatSerie(repetitions)

  const getVideoId = (link: string | null) => {
    if (link) return link.split('/').at(-1) || ''
    else return ''
  }
  return (
    <div className="">
      <div
        className={`outline-3 relative min-h-[350px] rounded-2xl bg-secondary px-5 py-4 shadow-lg outline -outline-offset-4 ${codeBorderColor}`}
      >
        <div
          className={`mb-2 flex h-7 w-20 items-center justify-center rounded-full ${codeBgColor}`}
        >
          <p className="font-bold">{exerciseNo}</p>
        </div>
        <h2 className="mb-1 min-h-[56px] font-medium text-secondary-foreground sm:text-lg">
          {exerciseName}
        </h2>
        <div className="flex gap-x-1">
          <span className="text-sm uppercase tracking-wide text-primary">
            Series por repeticiones: {repetitions}
          </span>
        </div>
        <div className="h-4"></div>
        <div className="relative mb-4 h-44 w-full flex-col items-center overflow-auto rounded-2xl bg-slate-100">
          {videoLink && (
            <YouTubeEmbed videoid={getVideoId(videoLink)} style="height: 176px; width: 100%;" />
          )}
        </div>
        <div className="mb-3 text-sm tracking-wide text-secondary-foreground">{comment}</div>
        {seconds && (
          <Timer
            numberOfSeries={parseInt(series!)}
            timePerSeries={seconds}
            timeRest={restTime || 15}
          />
        )}
      </div>
    </div>
  )
}
