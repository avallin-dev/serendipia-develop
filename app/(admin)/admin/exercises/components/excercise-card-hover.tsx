import { YouTubeEmbed } from '@next/third-parties/google'

type RoutineCardProps = {
  exerciseName: string | null
  videoLink: string | null
}

export default function RoutineCard({ exerciseName, videoLink }: RoutineCardProps) {
  const getVideoId = (link: string | null) => {
    if (link) return link.split('/').at(-1) || ''
    else return ''
  }
  return (
    <div className="w-96">
      <div className="outline-3 relative min-h-[350px] rounded-2xl bg-secondary px-5 py-4 shadow-lg outline -outline-offset-4">
        <h2 className="mb-1  min-h-[56px] text-lg font-medium text-secondary-foreground sm:text-xl">
          {exerciseName}
        </h2>
        <div className="h-4"></div>
        <div className="relative mb-4 h-56 w-full flex-col items-center overflow-auto rounded-2xl bg-slate-100">
          {videoLink && (
            <YouTubeEmbed videoid={getVideoId(videoLink)} style="height: 224px; width: 100%;" />
          )}
        </div>
      </div>
    </div>
  )
}
