import { YouTubeEmbed } from '@next/third-parties/google'
import { partner_comment, rutina_ejercicio_detalle } from '@prisma/client'

import Timer from '@/app/components/Timer'
import TimerMin from '@/app/components/TimerMin'
import { Button } from '@/app/components/ui/button'
import { useWeek } from '@/app/hooks/useWeek'
import formatSerie from '@/app/utils/formatSerie'

import EditableInput from './EditableInput'

type RoutineCardProps = {
  codeBorderColor: string
  codeBgColor: string
  exerciseNo: string
  exerciseName: string | null
  repetitions?: string | null
  videoLink: string | null
  comment?: string | null
  routineId: number
  routineComment: partner_comment[] | null
  hasDetails: boolean
  details: rutina_ejercicio_detalle[] | null
  onOpenFeedBackModal: (routineDetalleId: number) => void
}

export default function RoutineCard({
  codeBorderColor,
  codeBgColor,
  exerciseNo,
  exerciseName,
  repetitions,
  videoLink,
  comment,
  routineId,
  routineComment,
  hasDetails,
  details,
  onOpenFeedBackModal,
}: RoutineCardProps) {
  const { week } = useWeek()
  const { series, exerciseTime: seconds, restTime } = formatSerie(repetitions)

  const getVideoId = (link: string | null) => {
    if (link) return link.split('/').at(-1) || ''
    else return ''
  }

  const extractTimeFromComment = (comment: string) => {
    return comment.replace(/[^0-9]/g, '')
  }

  const commentByWeek = routineComment?.filter((e) => {
    return e.week === week
  })[0]?.comment

  const timeFromComment = comment ? extractTimeFromComment(comment) : '0'
  return (
    <div className="px-3 pb-7 pt-5">
      <div
        className={`outline-3 relative min-h-[400px] rounded-2xl bg-secondary px-5 py-4 shadow-lg outline -outline-offset-4 ${codeBorderColor}`}
      >
        <div
          className={`mb-2 flex h-7 w-20 items-center justify-center rounded-full ${codeBgColor}`}
        >
          <p className="font-bold">{exerciseNo}</p>
        </div>
        <h2 className="mb-1  min-h-[56px] text-lg font-medium text-secondary-foreground sm:text-xl">
          {exerciseName}
        </h2>
        {hasDetails && details && details.length > 0 ? (
          details.map((detail) => (
            <div key={detail.id} className="mb-2 flex items-center justify-between gap-x-1">
              <span className="text-nowrap text-xs uppercase tracking-wide text-primary">
                S: {detail.serie}
              </span>
              <span className="text-xs text-white">|</span>
              <span className="text-nowrap text-xs uppercase tracking-wide text-primary">
                R: {detail.repeticiones}
              </span>
              <span className="text-xs text-white">|</span>
              <span className="text-nowrap text-xs uppercase tracking-wide text-primary">
                D: {detail.descanso}
              </span>
              <span className="text-xs text-white">|</span>
              <Button size="sm" className="px-1" onClick={() => onOpenFeedBackModal(detail.id)}>
                Registro
              </Button>
            </div>
          ))
        ) : (
          <div className="flex gap-x-1">
            <span className="text-sm uppercase tracking-wide text-primary">
              Series por repeticiones: {repetitions}
            </span>
          </div>
        )}
        <div className="h-4"></div>
        <div className="relative mb-4 h-56 w-full flex-col items-center overflow-auto rounded-2xl bg-slate-100">
          {videoLink && (
            <YouTubeEmbed videoid={getVideoId(videoLink)} style="height: 224px; width: 100%;" />
          )}
        </div>
        <div className="mb-3 text-sm tracking-wide text-secondary-foreground">{comment}</div>
        <EditableInput routineId={routineId} value={commentByWeek} week={week} />
        <div className="h-2"></div>
        {comment && (comment.includes('emom') || comment.includes('amrap')) ? (
          <TimerMin initialTime={parseInt(timeFromComment)} />
        ) : seconds ? (
          <Timer
            numberOfSeries={parseInt(series!)}
            timePerSeries={seconds!}
            timeRest={restTime || 15}
          />
        ) : null}
      </div>
    </div>
  )
}
