import { YouTubeEmbed } from '@next/third-parties/google'
import Link from 'next/link'
import { FaArrowDown } from 'react-icons/fa'

import { Button } from '@/app/components/ui/button'
type RoutineCardProps = {
  title: string | null
  videoLink: string | null
  comment?: string | null
  file?: string | null
}

export default function ReadmeCard({ title, videoLink, comment, file }: RoutineCardProps) {
  const getVideoId = (link: string | null) => {
    if (link) return link.split('/').at(-1) || ''
    else return ''
  }
  return (
    <div className="px-3 pb-7 pt-5">
      <div className="outline-3 relative min-h-[400px] rounded-2xl bg-secondary px-5 py-4 shadow-lg">
        <h2 className="mb-1  min-h-[56px] text-lg font-medium text-secondary-foreground sm:text-xl">
          {title}
        </h2>
        <div className="h-4"></div>
        <div className="relative mb-4 h-56 w-full flex-col items-center overflow-auto rounded-2xl bg-slate-100">
          {videoLink && (
            <YouTubeEmbed videoid={getVideoId(videoLink)} style="height: 224px; width: 100%;" />
          )}
        </div>
        {file && (
          <Link target="_blank" href={file} className="mx-auto block text-center">
            <Button size="sm" className="size-14 rounded-full">
              <FaArrowDown size={25} />
            </Button>
          </Link>
        )}
        <div className="h-4"></div>
        <div className="mb-3 text-sm tracking-wide text-secondary-foreground">{comment}</div>
      </div>
    </div>
  )
}
